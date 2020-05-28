import { faSmile } from '@fortawesome/free-regular-svg-icons'
import {
  faBookmark,
  faClock,
  faCloud,
  faHeart,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import { message } from 'antd'
import Action, { ActionProps } from 'components/Action'
import CommentWrap from 'components/Comment'
import Markdown from 'components/MD-render'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { NoteLayout } from 'layouts/NoteLayout'
import { observer } from 'mobx-react'
import {
  Mood,
  MoodMap,
  NoteModel,
  NoteResp,
  Weather,
  WeatherMap,
} from 'models/dto/note'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import RemoveMarkdown from 'remove-markdown'
import { useStore } from 'store'
import { Rest } from 'utils/api'
import { parseDate, relativeTimeFromNow } from 'utils/time'
import { mood2icon, weather2icon } from 'utils/weather2icon'
import configs from '../../configs'

interface NoteViewProps {
  data: NoteModel
  prev: Partial<NoteModel>
  next: Partial<NoteModel>
}
// FIXME crash
const renderLines: FC = (props) => {
  if (!props.children) {
    return null
  }
  const isImage = !!((props.children as any)[0] as any)?.props?.src
  return (
    <p className={isImage ? undefined : 'indent'}>
      {isImage ? props.children : <span>{props.children}</span>}
    </p>
  )
}

const NoteView: NextPage<NoteViewProps> = (props) => {
  const { data, prev, next } = props
  const { title, _id, text, mood, weather } = data
  const { userStore, appStore } = useStore()

  const router = useRouter()
  const [tips, setTips] = useState(``)
  const removeMd = RemoveMarkdown(text)
  const description = removeMd.slice(0, 100)
  useEffect(() => {
    try {
      const wordCount = removeMd.length

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
    removeMd.length,
  ])
  useEffect(() => {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
  })
  const actions: ActionProps = {
    informs: [],
    actions: [
      {
        name: data.count.like !== 0 ? data.count.like.toString() : '喜欢',
        icon: faHeart,
        callback: () => {
          Rest('Note')
            .get<any>('like/' + _id, { withCredentials: true })
            .then(() => {
              message.success('感谢喜欢!')
            })
        },
      },
    ],
  }

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
      name: userStore.name as string,
      icon: faUser,
    },
    {
      name: relativeTimeFromNow(data.created),
      icon: faClock,
    },
    {
      name: data.count.read.toString(),
      icon: faBookmark,
    },
  )

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

  return (
    <>
      <NextSeo
        {...{
          title: title + ' - ' + (configs.title || appStore.title),
          description,
          openGraph: {
            title,
            description,
            profile: {
              username: userStore.name,
            },
          },
        }}
      />

      <NoteLayout title={title} date={new Date(data.created)} tips={tips}>
        <Markdown
          value={text}
          escapeHtml={false}
          renderers={{ paragraph: renderLines }}
        ></Markdown>
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
      <ArticleLayout style={{ minHeight: 'unset', paddingTop: '0' }}>
        <CommentWrap type={'Note'} id={_id} />
      </ArticleLayout>
    </>
  )
}

NoteView.getInitialProps = async ({ query }) => {
  const id = query.id as string
  const { data, prev, next } = await Rest('Note', 'nid').get<NoteResp>(id)
  return { data, prev, next }
}

export default observer(NoteView)
