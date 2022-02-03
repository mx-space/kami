import { faBookOpen, faClock } from '@fortawesome/free-solid-svg-icons'
import { NoteModel, RequestError } from '@mx-space/api-client'
import { NotePasswordConfrim } from 'components/in-page/NotePasswordConfirm'
import { BanCopy } from 'components/in-page/WarningOverlay/ban-copy'
import { ArticleLayout } from 'components/layouts/ArticleLayout'
import { NoteLayout } from 'components/layouts/NoteLayout'
import { LikeButton } from 'components/universal/LikeButton'
import { Loading } from 'components/universal/Loading'
import { Markdown } from 'components/universal/Markdown'
import { NumberRecorder } from 'components/universal/NumberRecorder'
import { RelativeTime } from 'components/universal/RelativeTime'
import {
  ActionProps,
  ArticleFooterAction,
} from 'components/widgets/ArticleAction'
import CommentWrap from 'components/widgets/Comment'
import dayjs from 'dayjs'
import { useHeaderMeta, useHeaderShare } from 'hooks/use-header-meta'
import { useLoadSerifFont } from 'hooks/use-load-serif-font'
import { useNoteMusic } from 'hooks/use-music'
import { isEqual, omit } from 'lodash-es'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { message } from 'react-message-popup'
import { useUpdate } from 'react-use'
import { store, useStore } from 'store'
import { imagesRecord2Map } from 'utils/images'
import { mood2icon, weather2icon } from 'utils/meta-icon'
import { springScrollToTop } from 'utils/spring'
import { parseDate } from 'utils/time'
import { Seo } from '../../components/universal/Seo'
import { ImageSizeMetaContext } from '../../context/image-size'
import { getSummaryFromMd, isDev, noop } from '../../utils'

const renderLines: FC<{ value: string }> = ({ value }) => {
  return <span className="indent">{value}</span>
}

const useUpdateNote = (id: string) => {
  const note = store.noteStore.get(id)
  const beforeModel = useRef<NoteModel>()

  useEffect(() => {
    const hideMessage = '此生活记录已被作者删除或隐藏'
    if (note?.isDeleted) {
      message.error(hideMessage)
      return
    }
    const before = beforeModel.current

    if (!before && note) {
      beforeModel.current = toJS(note)
      return
    }

    if (!before || !note || isEqual(before, toJS(note))) {
      return
    }

    if (before.id === note.id) {
      if (note.hide && !store.userStore.isLogged) {
        message.error(hideMessage)
        return
      }
      message.info('生活记录已更新')

      if (isDev) {
        console.log(
          'note-change: ',
          JSON.stringify(note),
          'before: ',
          JSON.stringify(before),
        )
      }
    }
    beforeModel.current = toJS(note)
    // TODO password etc.
  }, [
    note?.title,
    note?.text,
    note?.modified,
    note?.weather,
    note?.hide,
    note?.isDeleted,
  ])
}

const NoteView: React.FC<{ id: string }> = observer((props) => {
  const { userStore, noteStore } = useStore()
  const note = noteStore.get(props.id) || (noop as NoteModel)

  const router = useRouter()

  useEffect(() => {
    if (router.query.id === 'latest') {
      router.replace({
        pathname: '/notes/' + note.nid,
        query: { ...omit(router.query, 'id') },
      })
    }
  }, [note.nid])

  useEffect(() => {
    // FIXME: SSR 之后的 hydrate 没有同步数据
    if (!noteStore.relationMap.has(props.id)) {
      noteStore.fetchById(note.id, undefined, { force: true })
    }
  }, [note.id])

  useHeaderShare(note.title, note.text)
  useUpdateNote(note.id)
  useLoadSerifFont()
  useHeaderMeta(note.title, '生活观察日记')

  const { title, id, text } = note

  const [tips, setTips] = useState(``)

  const { description, wordCount } = getSummaryFromMd(text, {
    count: true,
    length: 150,
  })
  useEffect(() => {
    try {
      setTips(
        `创建于 ${parseDate(note.created, 'YYYY-MM-DD dddd')}${
          note.modified &&
          `, 修改于 ${parseDate(note.modified, 'YYYY-MM-DD dddd')}`
        }, 全文字数: ${wordCount}, 阅读次数: ${note.count.read}, 喜欢次数: ${
          note.count.like
        }`,
      )
      // eslint-disable-next-line no-empty
    } catch {}
  }, [
    text,
    note.created,
    note.modified,
    note.count.read,
    note.count.like,
    wordCount,
  ])

  useNoteMusic(note.music)

  const isSecret = note.secret ? dayjs(note.secret).isAfter(new Date()) : false
  const secretDate = useMemo(() => new Date(note.secret!), [note.secret])
  const dateFormat = note.secret
    ? Intl.DateTimeFormat('zh-cn', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
        year: 'numeric',
        day: 'numeric',
        month: 'long',
      }).format(secretDate)
    : ''
  useEffect(() => {
    let timer: any
    if (isSecret) {
      timer = setTimeout(() => {
        message.info('刷新以查看解锁的文章', 3)
      }, +secretDate - +new Date())
    }
    return () => {
      clearTimeout(timer)
    }
  }, [isSecret, secretDate])

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
              publishedTime: note.created,
              modifiedTime: note.modified || undefined,
              tags: ['Note of Life'],
            },
          },
        }}
      />

      <NoteLayout
        title={title}
        date={new Date(note.created)}
        tips={tips}
        bookmark={note.hasMemory}
        id={note.id}
      >
        {isSecret && !userStore.isLogged ? (
          <p className="text-center my-8">
            这篇文章暂时没有公开呢，将会在 {dateFormat} 解锁，再等等哦
          </p>
        ) : (
          <ImageSizeMetaContext.Provider
            value={useMemo(
              () => imagesRecord2Map(note.images || []),
              [note.images],
            )}
          >
            {isSecret && (
              <span className={'flex justify-center -mb-3.5'}>
                这是一篇非公开的文章。(将在 {dateFormat} 解锁)
              </span>
            )}

            <BanCopy>
              <Markdown
                value={text}
                escapeHtml={false}
                renderers={{ text: renderLines }}
                toc
              />
            </BanCopy>
          </ImageSizeMetaContext.Provider>
        )}

        <FooterNavigation id={props.id} />
        <div className="pb-4"></div>
        <FooterActionBar id={props.id} />
      </NoteLayout>
      {!isSecret && (
        <ArticleLayout
          style={{ minHeight: 'unset', paddingTop: '0' }}
          key={'at'}
        >
          <CommentWrap
            type={'Note'}
            id={id}
            allowComment={note.allowComment ?? true}
          />
        </ArticleLayout>
      )}
    </>
  )
})

const FooterActionBar: FC<{ id: string }> = observer(({ id }) => {
  const { noteStore } = useStore()
  const note = noteStore.get(id)

  if (!note) {
    return null
  }
  const nid = note.nid
  const { mood, weather } = note
  const isSecret = note.secret ? dayjs(note.secret).isAfter(new Date()) : false
  const isLiked = noteStore.isLiked(nid)
  const actions: ActionProps = {
    informs: [],
    actions: [
      {
        name: (
          <div className="inline-flex items-center leading-[1]">
            <div className="h-[1rem] w-[1rem] relative mr-2">
              <LikeButton
                checked={isLiked}
                width={'2rem'}
                className={
                  'absolute inset-0 -translate-y-1/2 -translate-x-1/2 transform '
                }
              />
            </div>
            <NumberRecorder number={note.count?.like || 0} />
          </div>
        ),
        color: isLiked ? '#e74c3c' : undefined,

        callback: () => {
          noteStore.like(nid)
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
        name: <RelativeTime date={new Date(note.created)} />,
        icon: faClock,
      },
      {
        name: note.count.read.toString(),
        icon: faBookOpen,
      },
    )
  }

  return <>{!isSecret && <ArticleFooterAction {...actions} />}</>
})

const FooterNavigation: FC<{ id: string }> = observer(({ id }) => {
  const { noteStore } = useStore()
  const [prev, next] =
    noteStore.relationMap.get(id) ||
    ([noop, noop] as [Partial<NoteModel>, Partial<NoteModel>])
  const router = useRouter()
  return (
    <>
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
                springScrollToTop()
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
    </>
  )
})

const PP: NextPage<NoteModel | { needPassword: true; id: string }> = observer(
  (props) => {
    const router = useRouter()
    const { noteStore } = useStore()
    const note = noteStore.get((props as NoteModel)?.id)

    const update = useUpdate()
    useEffect(() => {
      if (!note) {
        update()
      }
    }, [note])

    if ('needPassword' in props) {
      if (!note) {
        const fetchData = (password: string) => {
          const id = router.query.id as string
          noteStore
            .fetchById(isNaN(+id) ? id : +id, password)
            .catch((err) => {
              message.error('密码错误')
            })
            .then(() => {
              update()
            })
        }
        return <NotePasswordConfrim onSubmit={fetchData} />
      } else {
        return <NoteView id={note.id} />
      }
    }

    if (!note) {
      noteStore.add(props)

      return <Loading />
    }

    return <NoteView id={props.id} />
  },
)

PP.getInitialProps = async (ctx) => {
  const id = ctx.query.id as string
  const password = ctx.query.password as string
  if (id == 'latest') {
    return await store.noteStore.fetchLatest()
  }
  try {
    const res = await store.noteStore.fetchById(
      isNaN(+id) ? id : +id,
      password ? String(password) : undefined,
      { force: true },
    )
    return res as any
  } catch (err: any) {
    if (err instanceof RequestError) {
      if (err.status !== 403) {
        throw err
      }
      return { needPassword: true, id: +id }
    } else {
      throw err
    }
  }
}

export default PP
