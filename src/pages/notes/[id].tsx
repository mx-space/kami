import type { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { isEqual, omit } from 'lodash-es'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, {
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { message } from 'react-message-popup'
import { useUpdate } from 'react-use'

import type { NoteModel } from '@mx-space/api-client'
import { RequestError } from '@mx-space/api-client'

import { wrapperNextPage } from '~/components/biz/WrapperNextPage'
import { NoteFooterActionBar } from '~/components/in-page/Note/NoteActionBar'
import { NoteFooterActionBarForMobile } from '~/components/in-page/Note/NoteFooterNavigation'
import { NoteMarkdownRender } from '~/components/in-page/Note/NoteMarkdownRender'
import { NotePasswordConfrim } from '~/components/in-page/Note/NotePasswordConfirm'
import { NoteTopic } from '~/components/in-page/Note/NoteTopic'
import { BanCopy } from '~/components/in-page/WarningOverlay/ban-copy'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { NoteLayout } from '~/components/layouts/NoteLayout'
import { Loading } from '~/components/universal/Loading'
import { CommentLazy } from '~/components/widgets/Comment'
import { SearchFAB } from '~/components/widgets/Search'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useHeaderMeta, useHeaderShare } from '~/hooks/use-header-meta'
import { useJumpToSimpleMarkdownRender } from '~/hooks/use-jump-to-render'
import { useLoadSerifFont } from '~/hooks/use-load-serif-font'
import { useNoteMusic } from '~/hooks/use-music'
import { store, useStore } from '~/store'
import { imagesRecord2Map } from '~/utils/images'
import { getSummaryFromMd } from '~/utils/markdown'
import { parseDate } from '~/utils/time'
import { noop } from '~/utils/utils'

import { Seo } from '../../components/biz/Seo'
import { ImageSizeMetaContext } from '../../context/image-size'
import { isDev } from '../../utils/env'

const useUpdateNote = (id: string) => {
  const note = store.noteStore.get(id)
  const beforeModel = useRef<NoteModel>()
  const { event } = useAnalyze()
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

      event({
        action: TrackerAction.Interaction,
        label: `实时更新生活记录触发 - ${note.title}`,
      })

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
    note?.topicId,
  ])
}

const NoteView: React.FC<{ id: string }> = observer((props) => {
  const { userStore, noteStore } = useStore()
  const note = noteStore.get(props.id) || (noop as NoteModel)

  const router = useRouter()

  useEffect(() => {
    if (router.query.id === 'latest') {
      router.replace({
        pathname: `/notes/${note.nid}`,
        query: { ...omit(router.query, 'id') },
      })
    }
  }, [note.nid])

  useEffect(() => {
    // FIXME: SSR 之后的 hydrate 没有同步数据
    if (!noteStore.relationMap.has(props.id)) {
      noteStore.fetchById(note.nid, undefined, { force: true })
    }
  }, [note.nid])

  useHeaderShare(note.title)
  useUpdateNote(note.id)
  useLoadSerifFont()
  useHeaderMeta(
    note.title,
    `生活观察日记${note.topic ? ` / ${note.topic.name}` : ''}`,
  )
  useNoteMusic(note.music)

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
          note.modified
            ? `, 修改于 ${parseDate(note.modified, 'YYYY-MM-DD dddd')}`
            : ''
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

  useJumpToSimpleMarkdownRender(note.id)
  return (
    <>
      {createElement(Seo, {
        title,
        description,

        openGraph: {
          title,
          type: 'article',
          description,
          article: {
            publishedTime: note.created,
            modifiedTime: note.modified || undefined,
            tags: note.topic ? [note.topic.name] : [],
          },
        },
      })}

      <NoteLayout title={title} date={note.created} tips={tips} id={note.id}>
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
              <article>
                <h1 className="sr-only">{title}</h1>
                <NoteMarkdownRender text={text} />
              </article>
            </BanCopy>
          </ImageSizeMetaContext.Provider>
        )}
        <div className="pb-4" />
        {note.topic && <NoteTopic noteId={props.id} topic={note.topic} />}
        <NoteFooterActionBarForMobile id={props.id} />
        <div className="pb-4"></div>
        <NoteFooterActionBar id={props.id} />
      </NoteLayout>
      {!isSecret && (
        <ArticleLayout
          className="!pt-0 !min-h-[unset]"
          key={`comments-${props.id}`}
        >
          <CommentLazy
            id={id}
            key={id}
            allowComment={note.allowComment ?? true}
          />
        </ArticleLayout>
      )}

      <SearchFAB />
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
      if ((err.raw as AxiosError).response?.status !== 403) {
        throw err
      }
      return { needPassword: true, id: +id }
    } else {
      throw err
    }
  }
}

export default wrapperNextPage(PP)
