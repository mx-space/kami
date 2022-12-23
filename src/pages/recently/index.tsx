import { clsx } from 'clsx'
import { uniqWith } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import type { NextPage } from 'next'
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useInView } from 'react-intersection-observer'
import { message } from 'react-message-popup'
import useSWR from 'swr'

import type { RecentlyModel } from '@mx-space/api-client'
import {
  FontistoComments,
  JamTrash,
} from '@mx-space/kami-design/components/Icons/for-recently'
import { Loading } from '@mx-space/kami-design/components/Loading'

import { Seo } from '~/components/biz/Seo'
import { RefPreview } from '~/components/in-page/Recently/RefPreview'
import { RecentlySendBox } from '~/components/in-page/Recently/SendBox'
import { Markdown } from '~/components/universal/Markdown'
import { useModalStack } from '~/components/universal/Modal/stack-context'
import { RelativeTime } from '~/components/universal/RelativeTime'
import { CommentLazy } from '~/components/widgets/Comment'
import { useStore } from '~/store'
import { EventTypes } from '~/types/events'
import { apiClient } from '~/utils/client'
import { eventBus } from '~/utils/event-emitter'
import { NoSSRWrapper } from '~/utils/no-ssr'

import styles from './index.module.css'

const FETCH_SIZE = 10

const useDataEventHandler = () => {
  const [newData, setNewData] = useState<
    (RecentlyModel & { comments: number })[]
  >([])
  const [deleteIds, setDeleteIds] = useState<string[]>([])
  useEffect(() => {
    const create = (payload: RecentlyModel) => {
      setNewData((data) => [{ ...payload, comments: 0 }, ...data])
    }

    const del = ({ id }) => {
      setDeleteIds((ids) => [...ids, id])
    }

    eventBus.on(EventTypes.RECENTLY_CREATE, create)
    eventBus.on(EventTypes.RECENTLY_DElETE, del)

    return () => {
      eventBus.off(EventTypes.RECENTLY_CREATE, create)
      eventBus.off(EventTypes.RECENTLY_DElETE, del)
    }
  }, [])

  return { newData, deleteIds: new Set(deleteIds) }
}

const RecentlyPage: NextPage = () => {
  const [hasNext, setHasNext] = useState(true)
  const {
    userStore: { isLogged },
  } = useStore()

  const [fetchBefore, setFetchBefore] = useState<undefined | string>()
  const { data: fetchedData, isLoading } = useSWR(
    ['recent', fetchBefore],
    async ([, before]) => {
      const { data } = await apiClient.shorthand.getList(
        before,
        undefined,
        FETCH_SIZE,
      )

      if (data.length < FETCH_SIZE) {
        setHasNext(false)
      }
      return [before || 'root', data] as const
    },
    {
      isPaused() {
        return !hasNext
      },
    },
  )

  const [slicedData, setSliceData] = useState<
    Record<string, (RecentlyModel & { comments?: number })[]>
  >({})
  const data = useMemo(
    () => [...Object.values(slicedData)].flat(1),
    [slicedData],
  )

  useEffect(() => {
    if (!fetchedData) {
      return
    }
    const [key, data] = fetchedData

    if (!data) {
      return
    }

    setSliceData((d) => {
      return {
        ...d,
        [key]: data,
      }
    })
  }, [fetchedData])

  const { deleteIds, newData } = useDataEventHandler()

  const { ref, inView } = useInView()

  useEffect(() => {
    if (!data) {
      return
    }

    if (isLoading) {
      return
    }

    if (inView && hasNext) {
      setFetchBefore(data[data.length - 1].id)
    }
  }, [data, hasNext, inView, isLoading])

  const handleDelete = async (id: string) => {
    await apiClient.shorthand.proxy(id).delete()
    message.success('删除成功')
  }

  const wrapperProps = useRef({
    id: '',
    className: styles['md'],
  }).current

  const { present } = useModalStack()
  const handleClickComment = useCallback((id: string) => {
    present({
      modalProps: {
        title: '评论',
        closeable: true,
        fixedWidth: true,
      },
      component: (
        <CommentLazy allowComment id={id} warpperClassName={'!mt-0'} />
      ),
    })
  }, [])

  return (
    <main className="max-w-[50em] relative">
      <h1>动态</h1>
      <Seo title="动态" />
      <h2 className="text-opacity-80">谢谢你听我诉说</h2>
      {isLogged && <RecentlySendBox />}
      <div className="pb-4" />

      {isLoading ? (
        <Loading />
      ) : (
        <Fragment>
          {data.length == 0 && newData.length == 0 ? (
            <p className="text-center">这里还没有内容哦</p>
          ) : (
            <div className={styles['bubble-list']}>
              {uniqWith([...newData, ...data], (a, b) => a.id === b.id).map(
                (d) => {
                  if (deleteIds.has(d.id)) {
                    return null
                  }
                  return (
                    <Fragment key={d.id}>
                      <div
                        className={clsx(
                          'bubble',
                          isLogged ? 'from-me' : 'from-them',
                        )}
                      >
                        <div className="overflow-hidden">
                          <Markdown
                            forceBlock
                            value={d.content}
                            wrapperProps={wrapperProps}
                          />
                          {d.ref && <RefPreview refModel={d.ref} />}
                        </div>

                        <div className="text-sm float-right mt-1 flex items-center">
                          <button
                            className="inline-flex items-center"
                            onClick={() =>
                              d.allowComment ? handleClickComment(d.id) : void 0
                            }
                          >
                            <FontistoComments className="ml-2 mr-1 opacity-80" />
                            <span className="mr-2 opacity-80">
                              {d.comments || 0}
                            </span>
                          </button>
                          <RelativeTime date={d.created} />
                        </div>

                        {isLogged && (
                          <div
                            className="del"
                            onClick={() => handleDelete(d.id)}
                          >
                            <JamTrash className="mr-2" />
                            删除
                          </div>
                        )}
                      </div>

                      <div className="clear-both" />
                    </Fragment>
                  )
                },
              )}
            </div>
          )}

          {hasNext && (
            <div className="h-8" ref={ref}>
              {isLoading && <Loading />}
            </div>
          )}
        </Fragment>
      )}
    </main>
  )
}

export default NoSSRWrapper(observer(RecentlyPage))
