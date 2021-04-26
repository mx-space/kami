import { faBookOpen, faClock } from '@fortawesome/free-solid-svg-icons'
import { EventTypes } from 'common/socket/types'
import { useStore } from 'common/store'
import Action, { ActionProps } from 'components/Action'
import { QueueAnim } from 'components/Anime'
import CommentWrap from 'components/Comment'
import { LikeButton } from 'components/LikeButton'
import Markdown from 'components/MD-render'
import { NumberRecorder } from 'components/NumberRecorder'
import { OverLay } from 'components/Overlay'
import { RelativeTime } from 'components/Time'
import dayjs from 'dayjs'
import Cookies from 'js-cookie'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { NoteLayout } from 'layouts/NoteLayout'
import { NoteModel, NoteResp } from 'models/note'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Rest } from 'utils/api'
import { imagesRecord2Map } from 'utils/images'
import { message } from 'utils/message'
import { mood2icon, weather2icon } from 'utils/meta'
import { observer } from 'utils/mobx'
import observable from 'utils/observable'
import { parseDate } from 'utils/time'
import { ImageSizeMetaContext } from '../../common/context/ImageSizes'
import { Seo } from '../../components/SEO'
import { getSummaryFromMd, isLikedBefore, setLikeId } from '../../utils'

interface NoteViewProps {
  data: NoteModel
  prev: Partial<NoteModel>
  next: Partial<NoteModel>
}

const renderLines: FC<{ value: string }> = ({ value }) => {
  return <span className="indent">{value}</span>
}

const NoteView: NextPage<NoteViewProps> = observer(
  (props): JSX.Element => {
    const { prev, next } = props
    const [data, update] = useState(props.data)

    const router = useRouter()
    const { userStore, appStore, musicStore } = useStore()

    useEffect(() => {
      appStore.shareData = {
        text: data.text,
        title: data.title,
        url: location.href,
      }
      return () => {
        appStore.shareData = null
      }
    }, [data.text, data.title])

    useEffect(() => {
      update(props.data)
    }, [props.data])

    useEffect(() => {
      const handler = (payload: NoteModel) => {
        console.log(payload)

        if (payload._id === data._id) {
          if (payload.hide && !userStore.isLogged) {
            router.push('/notes')
            message.error('该日记已删除或隐藏')
            return
          }
          message.info('日记已更新')
          update(payload)
        }
      }

      observable.on(EventTypes.NOTE_UPDATE, handler)

      return () => {
        observable.off(EventTypes.NOTE_UPDATE, handler)
      }
    }, [data._id, router, userStore.isLogged])

    const { title, _id, text, mood, weather } = data

    const [like, setLikeCount] = useState(data.count.like ?? 0)

    const [tips, setTips] = useState(``)

    // prevent guest copy text.
    const mdRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!mdRef.current) {
        return
      }
      const $md = mdRef.current
      $md.oncopy = (e) => {
        if (userStore.isLogged) {
          return
        }
        e.preventDefault()
        setShowCopyWarn(true)
      }

      return () => {
        $md.oncopy = null
      }
    }, [userStore.isLogged])

    const { description, wordCount } = getSummaryFromMd(text, { count: true })
    useEffect(() => {
      try {
        setTips(
          `创建于 ${parseDate(
            data.created,
            'YYYY-MM-DD dddd',
          )}, 修改于 ${parseDate(
            data.modified,
            'YYYY-MM-DD dddd',
          )}, 全文字数: ${wordCount}, 阅读次数: ${data.count.read}, 喜欢次数: ${
            data.count.like
          }`,
        )
        // eslint-disable-next-line no-empty
      } catch {}
    }, [
      text,
      data.created,
      data.modified,
      data.count.read,
      data.count.like,
      wordCount,
    ])
    useEffect(() => {
      if (document.documentElement.scrollTop > 50) {
        document.documentElement.scrollTop = 50
      }
      setTimeout(() => {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' })
      }, 10)

      setLikeCount(props.data.count.like ?? 0)
      setLiked(false)
    }, [props])

    const [isLiked, setLiked] = useState(false)
    useEffect(() => {
      setLiked(isLikedBefore(data.nid.toString()))
      const handler = (nid) => {
        if (data.nid === nid) {
          setLiked(true)
          setLikeCount((like) => like + 1)
        }
      }
      observable.on('like', handler)

      return () => {
        observable.off('like', handler)
      }
    }, [data.nid])

    const actions: ActionProps = {
      informs: [],
      actions: [
        {
          // name: like !== 0 ? like : '喜欢',
          name: (
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              <LikeButton
                checked={like - 1 === data.count.like || isLiked}
                width={'2rem'}
              />
              <NumberRecorder number={like || 0} />
            </div>
          ),
          color:
            like - 1 === data.count.like || isLiked ? '#e74c3c' : undefined,

          callback: () => {
            if (like - 1 === data.count.like || isLiked) {
              return message.error('你已经喜欢过啦!')
            }
            Rest('Note')
              .get<any>('like/' + _id, {
                params: { ts: performance.timeOrigin + performance.now() },
              })
              .then(() => {
                message.success('感谢喜欢!')
                observable.emit('like', data.nid)
                setLikeId(data.nid.toString())
              })
              .catch(() => {
                setLiked(true)
              })
          },
        },
      ],
    }
    {
      if (weather) {
        actions.informs!.push({
          name: weather,
          icon: weather2icon(weather),
        })
      }
      if (mood) {
        actions.informs!.push({
          name: mood,
          icon: mood2icon(mood),
        })
      }

      actions.informs!.push(
        {
          name: <RelativeTime date={new Date(data.created)} />,
          icon: faClock,
        },
        {
          name: data.count.read.toString(),
          icon: faBookOpen,
        },
      )
    }

    useEffect(() => {
      appStore.headerNav = {
        title,
        meta: '日记',
        show: true,
      }
      return () => {
        appStore.headerNav.show = false
      }
    }, [appStore, title])

    // if this note has music, auto play it.

    useEffect(() => {
      // now support netease
      const ids =
        props.data.music &&
        Array.isArray(props.data.music) &&
        props.data.music.length > 0
          ? props.data.music
              .filter((m) => m.id && m.type === 'netease')
              .map((m) => ~~m.id)
          : null

      if (!ids) {
        return
      }
      musicStore.setPlaylist(ids)

      // eslint-disable-next-line react-hooks/exhaustive-deps

      return () => {
        musicStore.init().then(() => {
          musicStore.isHide = true
        })
      }
    }, [props.data.music, props.data.nid])

    const [showCopyWarn, setShowCopyWarn] = useState(false)
    const isSecret = props.data.secret
      ? dayjs(props.data.secret).isAfter(new Date())
      : false
    const afterDay = isSecret ? dayjs(props.data.secret!).fromNow(true) : ''
    return (
      <>
        <Seo
          {...{
            title: title,
            description,

            openGraph: {
              title,
              type: 'article',
              description,
              article: {
                publishedTime: data.created,
                modifiedTime: data.modified,
                tags: ['Note of Life'],
              },
            },
          }}
        />

        <NoteLayout
          title={title}
          date={new Date(data.created)}
          tips={tips}
          bookmark={data.hasMemory}
          id={data._id}
        >
          {isSecret && !userStore.isLogged ? (
            <p className="text-center my-8">
              这篇文章暂时没有公开呢，再过 {afterDay}
              就解锁了哦
            </p>
          ) : (
            <ImageSizeMetaContext.Provider
              value={imagesRecord2Map(props.data.images)}
            >
              {isSecret && (
                <span className={'flex justify-center -mb-3.5'}>
                  这是一篇非公开的文章。({afterDay}后解锁)
                </span>
              )}
              <Markdown
                ref={mdRef}
                value={text}
                escapeHtml={false}
                renderers={{ text: renderLines }}
                toc
              />
            </ImageSizeMetaContext.Provider>
          )}

          {!isSecret && <Action {...actions} />}

          {(!!next || !!prev) && (
            <section className="kami-more">
              {!!next && (
                <button
                  className="btn green"
                  onClick={() => {
                    router.push('/notes/[id]', `/notes/${next.nid}`)
                  }}
                >
                  前一篇
                </button>
              )}
              {
                <button
                  className="btn yellow"
                  onClick={() => {
                    window.scrollTo({
                      left: 0,
                      top: 0,
                      behavior: 'smooth',
                    })
                    router.push('/timeline?type=note')
                  }}
                >
                  时间线
                </button>
              }
              {!!prev && (
                <button
                  className="btn green"
                  onClick={() => {
                    router.push('/notes/[id]', `/notes/${prev.nid}`)
                  }}
                >
                  后一篇
                </button>
              )}
            </section>
          )}
        </NoteLayout>
        <OverLay
          onClose={() => {
            setShowCopyWarn(false)
          }}
          show={showCopyWarn}
          center
          darkness={0.8}
        >
          <h1 className={'mt-0 text-red pointer-events-none'}>注意: </h1>
          <div className="mb-0 text-white text-opacity-80 pointer-events-none">
            <p>本文章为站长原创, 保留版权所有, 禁止复制.</p>
          </div>
        </OverLay>
        {!isSecret && (
          <QueueAnim delay={500} type={'alpha'}>
            <ArticleLayout
              style={{ minHeight: 'unset', paddingTop: '0' }}
              focus
              key={'at'}
            >
              <CommentWrap
                type={'Note'}
                id={_id}
                allowComment={props.data.allowComment ?? true}
              />
            </ArticleLayout>
          </QueueAnim>
        )}
      </>
    )
  },
)

NoteView.getInitialProps = async (ctx) => {
  const id = ctx.query.id as string

  const res = await Rest('Note', 'nid').get<NoteResp>(id)
  return res
}

export default NoteView
