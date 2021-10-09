import { faClock } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { EventTypes } from 'common/socket/types'
import { useStore } from 'common/store'
import { Input } from 'components/Input'
import { Loading } from 'components/Loading'
import Markdown from 'components/Markdown'
import { RelativeTime } from 'components/RelativeTime'
import { throttle } from 'lodash'
import { observer } from 'mobx-react-lite'
import { RecentlyModel } from 'models/recently'
import { NextPage } from 'next'
import React, { FC, Fragment, memo, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { EventBus, NoSSR, Rest } from 'utils'
import styles from './index.module.scss'

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

    EventBus.on(EventTypes.RECENTLY_CREATE, create)
    EventBus.on(EventTypes.RECENTLY_DElETE, del)

    return () => {
      EventBus.off(EventTypes.RECENTLY_CREATE, create)
      EventBus.off(EventTypes.RECENTLY_DElETE, del)
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
      const { data } = await Rest('Recently').get<{ data: RecentlyModel[] }>(
        '',
        {
          params: { before, size },
        },
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

  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView && hasNext) {
      fetch({ before: data[data.length - 1].id })?.then((newData) => {
        setData(data.concat(newData))
      })
    }
  }, [data, hasNext, inView])
  const handleDelete = (id: string) => {
    Rest('Recently').del(id)
  }
  return (
    <main className="is-article">
      <h1>动态</h1>
      <h2 className="text-opacity-80">谢谢你听我诉说</h2>
      {isLogged && <RecentlyBox />}
      <div className="pb-4"></div>
      {data.length === 0 && loading ? (
        <Loading />
      ) : (
        <Fragment>
          {data.length == 0 ? (
            <p className="text-center">这里还没有内容哦</p>
          ) : (
            <Fragment>
              {data.map((d) => (
                <div key={d.id} className={styles['recently-wrapper']}>
                  <div className={clsx(styles['content'], 'my-2')}>
                    <Markdown escapeHtml={false} value={d.content} />
                  </div>
                  <div
                    className={clsx(
                      styles['footer'],
                      'text-right my-2 opacity-80 relative',
                    )}
                  >
                    {isLogged && (
                      <span
                        className={clsx(
                          'text-red float-left opacity-0 cursor-pointer transition-opacity',
                          styles['del'],
                        )}
                        onClick={() => handleDelete(d.id)}
                      >
                        删除
                      </span>
                    )}
                    <FontAwesomeIcon icon={faClock} />
                    &nbsp;
                    <RelativeTime date={new Date(d.created)}></RelativeTime>
                  </div>
                </div>
              ))}
            </Fragment>
          )}

          {hasNext && (
            <div style={{ height: '20px' }} ref={ref}>
              {loading && <Loading />}
            </div>
          )}
        </Fragment>
      )}
    </main>
  )
}

const RecentlyBox: FC = memo(() => {
  const [content, setText] = useState('')

  const taRef = useRef<HTMLTextAreaElement>(null)
  const handleSubmit = () => {
    Rest('Recently')
      .post({
        content,
      })
      .then(() => {
        setText('')
        taRef.current && (taRef.current.value = '')
      })
  }
  return (
    <form
      action="#"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
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
export default NoSSR(observer(RecentlyPage))
