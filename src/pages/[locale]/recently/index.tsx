import { clsx } from 'clsx'
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

import { useLocale } from '~/i18n/navigation'
import { useTranslations } from 'next-intl'
import {
  RecentlyAttitudeEnum,
  RecentlyAttitudeResultEnum,
} from '@mx-space/api-client'

import { useIsLogged } from '~/atoms/user'
import { withNoSSR } from '~/components/app/HoC/no-ssr'
import { Seo } from '~/components/app/Seo'
import { KamiMarkdown } from '~/components/common/KamiMarkdown'
import { RelativeTime } from '~/components/common/RelativeTime'
import { RefPreview } from '~/components/in-page/Recently/RefPreview'
import { RecentlySendBox } from '~/components/in-page/Recently/SendBox'
import { IonThumbsup } from '~/components/ui/Icons/for-post'
import { FontistoComments, JamTrash } from '~/components/ui/Icons/for-recently'
import { Loading } from '~/components/ui/Loading'
import { useModalStack } from '~/components/ui/Modal/stack-context'
import { CommentLazy } from '~/components/widgets/Comment'
import { EventTypes } from '~/types/events'
import { sample, uniqWith } from '~/utils/_'
import { apiClient } from '~/utils/client'
import { eventBus } from '~/utils/event-emitter'

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
  const t = useTranslations('recently')
  const [hasNext, setHasNext] = useState(true)
  const isLogged = useIsLogged()
  const locale = useLocale()

  const [fetchBefore, setFetchBefore] = useState<undefined | string>()
  const { data: fetchedData, isLoading } = useSWR(
    ['recent', fetchBefore, locale],
    async ([, before]) => {
      const { data } = await apiClient.shorthand.getList({
        before,
        after: undefined,
        size: FETCH_SIZE,
      })

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
  const loading = isLoading && data.length == 0

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

    if (loading) {
      return
    }

    if (inView && hasNext) {
      setFetchBefore(data[data.length - 1]?.id)
    }
  }, [data, hasNext, inView, loading])

  const handleDelete = async (id: string) => {
    await apiClient.shorthand.proxy(id).delete()
    message.success(t('deleteSuccess'))
  }

  const wrapperProps = useRef({
    id: '',
    className: styles['md'],
  }).current

  const { present } = useModalStack()
  const handleClickComment = useCallback((model: RecentlyModel) => {
    present({
      modalProps: {
        title: t('comment'),
        closeable: true,
        fixedWidth: true,
        useRootPortal: true,
      },
      overlayProps: {
        stopPropagation: true,
      },
      component: (
        <>
          <p className="!mt-4 whitespace-pre-line break-all leading-6">
            {model.content}
          </p>
          <CommentLazy allowComment id={model.id} />
        </>
      ),
    })
  }, [])

  const handleUp = (id: string) => {
    apiClient.recently
      .attitude(id, RecentlyAttitudeEnum.Up)
      .then(({ code }) => {
        if (code === RecentlyAttitudeResultEnum.Inc) {
          message.success(sample([t('upInc'), t('upIncAlt')])!)
        } else {
          message.success(t('upDec'))
        }
      })
  }

  const handleDown = (id: string) => {
    apiClient.recently
      .attitude(id, RecentlyAttitudeEnum.Down)
      .then(({ code }) => {
        if (code === RecentlyAttitudeResultEnum.Inc) {
          message.success(t('downInc'))
        } else {
          message.success(t('downDec'))
        }
      })
  }

  return (
    <main className="relative max-w-[50em]">
      <h1>{t('title')}</h1>
      <Seo title={t('title')} />
      <h2 className="text-opacity-80">{t('subtitle')}</h2>
      {isLogged && <RecentlySendBox />}
      <div className="pb-4" />

      {loading ? (
        <Loading />
      ) : (
        <Fragment>
          {data.length == 0 && newData.length == 0 ? (
            <p className="text-center">{t('empty')}</p>
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
                          <KamiMarkdown
                            forceBlock
                            value={d.content}
                            wrapperProps={wrapperProps}
                          />
                          {d.ref && <RefPreview refModel={d.ref} />}
                        </div>

                        <div className="float-right mt-1 flex items-center text-sm">
                          <button
                            className="inline-flex items-center"
                            onClick={() =>
                              d.allowComment ? handleClickComment(d) : void 0
                            }
                          >
                            <FontistoComments className="ml-2 mr-1 opacity-80" />
                            <span className="mr-2 opacity-80">
                              {d.comments || 0}
                            </span>
                          </button>
                          <RelativeTime date={d.created} />
                        </div>

                        <div className="actions">
                          {isLogged && (
                            <button
                              className="text-red flex items-center"
                              onClick={() => handleDelete(d.id)}
                            >
                              <JamTrash className="mr-2" />
                              {t('delete')}
                            </button>
                          )}
                          <button
                            className="text-red ml-2 flex items-center"
                            onClick={() => handleUp(d.id)}
                          >
                            <IonThumbsup />
                            {isLogged && d.up}
                          </button>

                          <button
                            className="text-shizuku-text ml-2 flex items-center"
                            onClick={() => handleDown(d.id)}
                          >
                            <IonThumbsup className="rotate-[1.5turn] transform" />
                            {isLogged && d.down}
                          </button>
                        </div>
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

export default withNoSSR(RecentlyPage)
