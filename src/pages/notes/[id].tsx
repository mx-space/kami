import type { AxiosError } from 'axios'
import dayjs from 'dayjs'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import React, {
  createElement,
  lazy,
  memo,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { message } from 'react-message-popup'
import useUpdate from 'react-use/lib/useUpdate'

import type { NoteModel } from '@mx-space/api-client'
import { RequestError } from '@mx-space/api-client'

import { noteCollection, useNoteCollection } from '~/atoms/collections/note'
import type { ModelWithDeleted } from '~/atoms/collections/utils/base'
import { useIsLogged, useUserStore } from '~/atoms/user'
import { Suspense } from '~/components/app/Suspense'
import { wrapperNextPage } from '~/components/app/WrapperNextPage'
import { NoteFooterNavigationBarForMobile } from '~/components/in-page/Note/NoteFooterNavigation'
import { NoteMarkdownRender } from '~/components/in-page/Note/NoteMarkdownRender'
import { NotePasswordConfrim } from '~/components/in-page/Note/NotePasswordConfirm'
import { BanCopy } from '~/components/in-page/Note/WarningOverlay/ban-copy'
import { NoteLayout } from '~/components/layouts/NoteLayout'
import { Banner } from '~/components/ui/Banner'
import { ImageSizeMetaContext } from '~/components/ui/Image/context'
import { Loading } from '~/components/ui/Loading'
import { SearchFAB } from '~/components/widgets/Search'
import { SubscribeBell } from '~/components/widgets/SubscribeBell'
import { XLogInfoForNote } from '~/components/widgets/xLogInfo'
import { XLogSummaryForNote } from '~/components/widgets/xLogSummary'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import {
  useSetHeaderMeta,
  useSetHeaderShare,
} from '~/hooks/app/use-header-meta'
import { useJumpToSimpleMarkdownRender } from '~/hooks/app/use-jump-to-render'
import { useNoteMusic } from '~/hooks/app/use-music'
import { useLoadSerifFont } from '~/hooks/ui/use-load-serif-font'
import { isEqualObject, omit } from '~/utils/_'
import { imagesRecord2Map } from '~/utils/images'
import { getSummaryFromMd } from '~/utils/markdown'
import { parseDate } from '~/utils/time'
import { noop } from '~/utils/utils'

import { Seo } from '../../components/app/Seo'
import { isDev } from '../../utils/env'

const NoteTopic = lazy(() =>
  import('~/components/in-page/Note/NoteTopic').then((mo) => ({
    default: mo.NoteTopic,
  })),
)

const CommentLazy = lazy(() =>
  import('~/components/widgets/Comment').then((mo) => ({
    default: mo.CommentLazy,
  })),
)

const ArticleLayout = lazy(() =>
  import('~/components/layouts/ArticleLayout').then((mo) => ({
    default: mo.ArticleLayout,
  })),
)

const NoteFooterActionBar = lazy(() =>
  import('~/components/in-page/Note/NoteActionBar').then((mo) => ({
    default: mo.NoteFooterActionBar,
  })),
)

const useUpdateNote = (note: ModelWithDeleted<NoteModel>) => {
  const beforeModel = useRef<NoteModel>()
  const { event } = useAnalyze()
  useEffect(() => {
    const hideMessage = '此手记已被作者删除或隐藏'
    if (note?.isDeleted) {
      message.error(hideMessage)
      return
    }
    const before = beforeModel.current

    if (!before && note) {
      beforeModel.current = { ...note }
      return
    }

    if (!before || !note || isEqualObject(before, { ...note })) {
      return
    }

    if (before.id === note.id) {
      if (note.hide && !useUserStore.getState().isLogged) {
        message.error(hideMessage)
        return
      }
      message.info('手记已更新')

      event({
        action: TrackerAction.Interaction,
        label: `实时更新手记触发 - ${note.title}`,
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
    beforeModel.current = { ...note }
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

const NoteView: React.FC<{ id: string }> = memo((props) => {
  const note = useNoteCollection(
    (state) => state.get(props.id) || (noop as NoteModel),
  )

  const router = useRouter()

  useEffect(() => {
    if (router.query.id === 'latest') {
      router.replace({
        pathname: `/notes/${note.nid}`,
        query: { ...omit(router.query, 'id' as any) },
      })
    }
  }, [note.nid])

  useEffect(() => {
    // FIXME: SSR 之后的 hydrate 没有同步数据
    if (!noteCollection.relationMap.has(props.id)) {
      noteCollection.fetchById(note.nid, undefined, { force: true })
    }
  }, [note.nid])

  useSetHeaderShare(note.title)
  useUpdateNote(note)
  useLoadSerifFont()
  useSetHeaderMeta(
    note.title,
    `手记${note.topic ? ` / ${note.topic.name}` : ''}`,
  )
  useNoteMusic(note.music)
  useJumpToSimpleMarkdownRender(note.id)

  const { title, id, text } = note
  const { description, wordCount } = getSummaryFromMd(text, {
    count: true,
    length: 150,
  })

  const tips = useMemo(() => {
    return `创建于 ${parseDate(note.created, 'YYYY 年 M 月 D 日 dddd')}${
      note.modified
        ? `，修改于 ${parseDate(note.modified, 'YYYY 年 M 月 D 日 dddd')}`
        : ''
    }，全文字数：${wordCount}，阅读次数：${note.count.read}，喜欢次数：${
      note.count.like
    }`
  }, [note.count.like, note.count.read, note.created, note.modified, wordCount])

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
    const timeout = +secretDate - +new Date()
    // https://stackoverflow.com/questions/3468607/why-does-settimeout-break-for-large-millisecond-delay-values
    const MAX_TIMEOUT = (2 ^ 31) - 1
    if (isSecret && timeout && timeout < MAX_TIMEOUT) {
      timer = setTimeout(() => {
        message.info('刷新以查看解锁的文章', 10e3)
      }, timeout)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [isSecret, secretDate])

  const imageSizeProviderValue = useMemo(
    () => imagesRecord2Map(note.images || []),
    [note.images],
  )
  const isLogged = useIsLogged()

  return (
    <>
      {createElement(Seo, {
        title,
        description,
        image: note.meta?.cover || note.images?.[0]?.src,
        canUseRandomImage: false,

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
        {isSecret && !isLogged ? (
          <Banner type="warning" className="mt-4">
            这篇文章暂时没有公开呢，将会在 {dateFormat} 解锁，再等等哦
          </Banner>
        ) : (
          <ImageSizeMetaContext.Provider value={imageSizeProviderValue}>
            {isSecret && (
              <Banner type="info" className="mt-4">
                这是一篇非公开的文章。(将在 {dateFormat} 解锁)
              </Banner>
            )}
            <XLogSummaryForNote id={props.id} />

            <BanCopy>
              <article>
                <h1 className="sr-only">{title}</h1>
                <NoteMarkdownRender text={text} />
              </article>
            </BanCopy>
          </ImageSizeMetaContext.Provider>
        )}
        <div className="pb-8" />
        {note.topic && (
          <Suspense>
            <NoteTopic noteId={props.id} topic={note.topic} />
          </Suspense>
        )}

        <NoteFooterNavigationBarForMobile id={props.id} />
        <div className="pb-4" />
        <SubscribeBell defaultType="note_c" />
        <XLogInfoForNote id={props.id} />
        <Suspense>
          <NoteFooterActionBar id={props.id} />
        </Suspense>
      </NoteLayout>

      {!isSecret && (
        <Suspense>
          <ArticleLayout
            className="!min-h-[unset] !pt-0"
            key={`comments-${props.id}`}
          >
            <Suspense>
              <CommentLazy
                id={id}
                key={id}
                allowComment={note.allowComment ?? true}
              />
            </Suspense>
          </ArticleLayout>
        </Suspense>
      )}

      <SearchFAB />
    </>
  )
})

const PP: NextPage<NoteModel | { needPassword: true; id: string }> = (
  props,
) => {
  const router = useRouter()

  const noteId = useNoteCollection((state) => state.get(props.id)?.id)

  const update = useUpdate()
  useEffect(() => {
    if (!noteId) {
      update()
    }
  }, [noteId])

  if ('needPassword' in props) {
    if (!noteId) {
      const fetchData = (password: string) => {
        const id = router.query.id as string
        noteCollection
          .fetchById(isNaN(+id) ? id : +id, password)
          .catch(() => {
            message.error('密码错误')
          })
          .then(() => {
            update()
          })
      }
      return <NotePasswordConfrim onSubmit={fetchData} />
    } else {
      return <NoteView id={noteId} />
    }
  }

  if (!noteId) {
    noteCollection.add(props)

    return <Loading />
  }

  return <NoteView id={props.id} />
}

PP.getInitialProps = async (ctx) => {
  const id = ctx.query.id as string
  const password = ctx.query.password as string
  if (id == 'latest') {
    return await noteCollection.fetchLatest()
  }
  try {
    const res = await noteCollection.fetchById(
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
