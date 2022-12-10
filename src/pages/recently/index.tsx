import { clsx } from 'clsx'
import throttle from 'lodash-es/throttle'
import { observer } from 'mobx-react-lite'
import type { NextPage } from 'next'
import Link from 'next/link'
import type { FC } from 'react'
import React, {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useInView } from 'react-intersection-observer'
import { eventBus } from 'utils/event-emitter'

import type { RecentlyModel } from '@mx-space/api-client'
import { Divider } from '@mx-space/kami-design/components/Divider'
import {
  JamTrash,
  PhLinkFill,
} from '@mx-space/kami-design/components/Icons/for-recently'
import { Input } from '@mx-space/kami-design/components/Input'
import { Loading } from '@mx-space/kami-design/components/Loading'

import { Seo } from '~/components/biz/Seo'
import { Markdown } from '~/components/universal/Markdown'
import { RelativeTime } from '~/components/universal/RelativeTime'
import { useStore } from '~/store'
import { EventTypes } from '~/types/events'
import { apiClient } from '~/utils/client'
import { NoSSRWrapper } from '~/utils/no-ssr'
import { urlBuilder } from '~/utils/url'

import styles from './index.module.css'

const FETCH_SIZE = 10

const RecentlyPage: NextPage = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<RecentlyModel[]>([])
  const [hasNext, setHasNext] = useState(true)
  const {
    userStore: { isLogged },
  } = useStore()
  // bind event

  useEffect(() => {
    const create = (payload: RecentlyModel) => {
      data.unshift(payload)
      setData([...data])
    }

    const del = ({ id }) => {
      const index = data.findIndex((d) => d.id === id)
      if (index != -1) {
        data.splice(index, 1)
        setData([...data])
      }
    }

    eventBus.on(EventTypes.RECENTLY_CREATE, create)
    eventBus.on(EventTypes.RECENTLY_DElETE, del)

    return () => {
      eventBus.off(EventTypes.RECENTLY_CREATE, create)
      eventBus.off(EventTypes.RECENTLY_DElETE, del)
    }
  }, [data])

  const fetch = throttle(
    async ({
      before,
      size = FETCH_SIZE,
    }: {
      before?: string
      size?: number
    }) => {
      setLoading(true)
      const { data } = await apiClient.shorthand.getList(
        before,
        undefined,
        size,
      )

      if (data.length < FETCH_SIZE) {
        setHasNext(false)
      }
      setLoading(false)
      return data
    },
    1000,
  )

  useEffect(() => {
    fetch({})?.then((data) => {
      setData(data)
    })
  }, [])

  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNext) {
      fetch({ before: data[data.length - 1].id })?.then((newData) => {
        setData((data) => data.concat(newData))
      })
    }
  }, [data, hasNext, inView])
  const handleDelete = async (id: string) => {
    await apiClient.shorthand.proxy(id).delete()
  }

  const wrapperProps = useRef({
    id: '',
    className: styles['md'],
  }).current

  return (
    <main className="max-w-[50em] relative">
      <h1>动态</h1>
      <Seo title="动态" />
      <h2 className="text-opacity-80">谢谢你听我诉说</h2>
      {isLogged && <RecentlyBox />}
      <div className="pb-4" />
      {data.length === 0 && loading ? (
        <Loading />
      ) : (
        <Fragment>
          {data.length == 0 ? (
            <p className="text-center">这里还没有内容哦</p>
          ) : (
            <div className={styles['bubble-list']}>
              {data.map((d) => (
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

                    <div className="text-sm float-right mt-1">
                      <RelativeTime date={d.created} />
                    </div>

                    {isLogged && (
                      <div className="del" onClick={() => handleDelete(d.id)}>
                        <JamTrash className="mr-2" />
                        删除
                      </div>
                    )}
                  </div>

                  <div className="clear-both" />
                </Fragment>
              ))}
            </div>
          )}

          {hasNext && (
            <div className="h-8" ref={ref}>
              {loading && <Loading />}
            </div>
          )}
        </Fragment>
      )}
    </main>
  )
}

const RefPreview: FC<{ refModel: any }> = (props) => {
  const title = props.refModel?.title

  const url = useMemo(() => {
    return urlBuilder.build(props.refModel)
  }, [props.refModel])

  if (!title) {
    return null
  }

  return (
    <>
      <Divider className="my-4 bg-current w-12 opacity-50" />
      <p className="leading-[1.8] flex items-center">
        发表于： <PhLinkFill className="mr-2" />
        <Link href={url}>{title}</Link>
      </p>
    </>
  )
}

const RecentlyBox: FC = memo(() => {
  const [content, setText] = useState('')

  const taRef = useRef<HTMLTextAreaElement>(null)
  const handleSubmit = useCallback(() => {
    apiClient.shorthand.proxy.post({ data: { content } }).then(() => {
      setText('')
      taRef.current && (taRef.current.value = '')
    })
  }, [content])
  return (
    <form
      action="#"
      onSubmit={useCallback(
        (e) => {
          e.preventDefault()
          handleSubmit()
        },
        [handleSubmit],
      )}
    >
      <Input
        multi
        // @ts-ignore
        ref={taRef}
        // @ts-ignore
        rows={4}
        required
        onChange={(e) => {
          setText(e.target.value)
        }}
        autoFocus={true}
        placeholder={'今天遇到了什么烦心事?'}
      />
      <div className="mt-3 text-right">
        <button
          className="btn yellow"
          onClick={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          disabled={content.trim().length === 0}
        >
          发送
        </button>
      </div>
    </form>
  )
})
export default NoSSRWrapper(observer(RecentlyPage))
