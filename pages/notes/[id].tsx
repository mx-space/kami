import { faSmile } from '@fortawesome/free-regular-svg-icons'
import {
  faBookOpen,
  faClock,
  faCloud,
  faHeart,
} from '@fortawesome/free-solid-svg-icons'
import { useStore } from 'common/store'
import Action, { ActionProps } from 'components/Action'
import { QueueAnim } from 'components/Anime'
import CommentWrap from 'components/Comment'
import Markdown from 'components/MD-render'
import { NumberRecorder } from 'components/NumberRecorder'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { NoteLayout } from 'layouts/NoteLayout'
import {
  Mood,
  MoodMap,
  NoteModel,
  NoteResp,
  Weather,
  WeatherMap,
} from 'models/note'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { Rest } from 'utils/api'
import { message } from 'utils/message'
import { observer } from 'utils/mobx'
import { parseDate, relativeTimeFromNow } from 'utils/time'
import { mood2icon, weather2icon } from 'utils/weather2icon'
import { ImageSizesContext } from '../../common/context/ImageSizes'
import { Seo } from '../../components/SEO'
import { getSummaryFromMd } from '../../utils'

interface NoteViewProps {
  data: NoteModel
  prev: Partial<NoteModel>
  next: Partial<NoteModel>
}

const renderLines: FC<{ value: string }> = ({ value }) => {
  // if (!props.children) {
  //   return null
  // }
  // const isImage = !!((props.children as any)[0] as any)?.props?.src
  // return (
  //   <p className={isImage ? undefined : 'indent'}>
  //     {isImage ? props.children : <span>{props.children}</span>}
  //   </p>
  // )
  return <span className="indent">{value}</span>
}

const NoteView: NextPage<NoteViewProps> = observer(
  (props): JSX.Element => {
    const { data, prev, next } = props
    const { title, _id, text, mood, weather } = data
    const { userStore, appStore, musicStore } = useStore()
    const [like, setLike] = useState(data.count.like ?? 0)
    const router = useRouter()
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
        message.warn('禁止复制!')
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

      setLike(props.data.count.like ?? 0)
    }, [props])
    const [isLiked, setLiked] = useState(false)
    const actions: ActionProps = {
      informs: [],
      actions: [
        {
          // name: like !== 0 ? like : '喜欢',
          name: <NumberRecorder number={like || 0} />,
          icon: faHeart,
          color:
            like - 1 === data.count.like || isLiked ? '#e74c3c' : undefined,
          callback: () => {
            if (like - 1 === data.count.like) {
              return message.error('你已经喜欢过啦!')
            }
            Rest('Note')
              .get<any>('like/' + _id, { withCredentials: true })
              .then(() => {
                message.success('感谢喜欢!')
                setLike(like + 1)
              })
              .catch(() => {
                setLiked(true)
              })
          },
        },
      ],
    }
    {
      if (weather && Object.keys(Weather).includes(weather)) {
        actions.informs!.push({
          name: WeatherMap[weather],
          icon: weather2icon(weather),
        })
      } else if (weather) {
        actions.informs!.push({
          name: weather,
          icon: faCloud,
        })
      }
      if (mood && Object.keys(Mood).includes(mood)) {
        actions.informs!.push({
          name: MoodMap[mood],
          icon: mood2icon(mood),
        })
      } else if (mood) {
        actions.informs!.push({
          name: mood,
          icon: faSmile,
        })
      }

      actions.informs!.push(
        {
          name: relativeTimeFromNow(data.created),
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
    }, [props.data.nid])

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

        <NoteLayout title={title} date={new Date(data.created)} tips={tips}>
          <ImageSizesContext.Provider value={props.data.images}>
            <Markdown
              ref={mdRef}
              value={text}
              escapeHtml={false}
              renderers={{ text: renderLines }}
            />
          </ImageSizesContext.Provider>

          <Action {...actions} />

          {(!!next || !!prev) && (
            <section className="paul-more">
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
      </>
    )
  },
)
NoteView.getInitialProps = async ({ query }) => {
  const id = query.id as string
  const { data, prev, next } = await Rest('Note', 'nid').get<NoteResp>(id)
  return { data, prev, next }
}

export default NoteView
