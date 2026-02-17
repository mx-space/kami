import { pick } from 'lodash-es'
import type { NextPage } from 'next'
import { title } from 'process'
import type { FC } from 'react'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { shallow } from 'zustand/shallow'

import type { NoteModel, PageModel, PostModel } from '@mx-space/api-client'
import { simpleCamelcaseKeys } from '@mx-space/api-client'

import { useNoteCollection } from '~/atoms/collections/note'
import { usePageCollection } from '~/atoms/collections/page'
import { usePostCollection } from '~/atoms/collections/post'
import { KamiMarkdown } from '~/components/common/KamiMarkdown'
import { NoteMarkdownRender } from '~/components/in-page/Note/NoteMarkdownRender'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { NoteLayout } from '~/components/layouts/NoteLayout'
import { Banner } from '~/components/ui/Banner'
import { ImageSizeMetaContext } from '~/components/ui/Image/context'
import { getLocaleFromContext } from '~/i18n/navigation'
import { isServerSide } from '~/utils/env'
import { setRequestLocale } from '~/utils/client'

const noopMap = new Map()
const NotePreviewPage: FC<{ data: NoteModel }> = ({ data }) => {
  const id = data.id

  const note = useNoteCollection(
    (state) => pick(state.data.get(id), ['id', 'text', 'created', 'title']),
    shallow,
  )

  useEffect(() => {
    useNoteCollection.getState().add(data)
  }, [])
  if (!note) return null
  const { text, created, title } = note

  return (
    <NoteLayout title={title!} date={created!} id={data.id} isPreview>
      <article>
        <h1 className="sr-only">{title}</h1>
        <ImageSizeMetaContext.Provider value={noopMap}>
          <NoteMarkdownRender text={text!} />
        </ImageSizeMetaContext.Provider>
      </article>
    </NoteLayout>
  )
}

const PostPreviewPage: FC<{ data: PostModel }> = ({ data }) => {
  const t = useTranslations('preview')
  const post = usePostCollection(
    (state) =>
      pick(state.data.get(data.id), ['id', 'title', 'summary', 'text']),
    shallow,
  )
  useEffect(() => {
    usePostCollection.getState().add(data)
  }, [])
  if (!post) return null

  return (
    <ArticleLayout
      title={post.title}
      id={post.id}
      type="post"
      titleAnimate={false}
    >
      <Banner type="info" className="mb-8">
        {t('mode')}
      </Banner>

      {post.summary && (
        <Banner type="info" placement="left" showIcon={false} className="mb-8">
          <p className="leading-[1.7]">{t('summary')} {post.summary}</p>
        </Banner>
      )}

      <article>
        <h1 className="sr-only">{post.title}</h1>

        <ImageSizeMetaContext.Provider value={noopMap}>
          <KamiMarkdown codeBlockFully value={post.text} toc />
        </ImageSizeMetaContext.Provider>
      </article>
    </ArticleLayout>
  )
}

const PagePreviewPage: FC<{ data: PageModel }> = ({ data }) => {
  const t = useTranslations('preview')
  const page = usePageCollection((state) => {
    return pick(state.data.get(data.id), ['subtitle', 'text'])
  }, shallow)
  useEffect(() => {
    usePageCollection.getState().add(data)
  }, [])
  if (!page) return null
  return (
    <ArticleLayout
      title={title}
      subtitle={page.subtitle}
      id={data.id}
      type="page"
    >
      <Banner type="info" className="mb-8">
        {t('mode')}
      </Banner>

      <ImageSizeMetaContext.Provider value={noopMap}>
        <article>
          <h1 className="sr-only">{title}</h1>
          <KamiMarkdown value={page.text} toc />
        </article>
      </ImageSizeMetaContext.Provider>
    </ArticleLayout>
  )
}

const PreviewPage: NextPage<{ storageKey: string }> = ({ storageKey }) => {
  if (!storageKey) {
    return null
  }
  if (isServerSide()) return null
  const storage = window.localStorage.getItem(storageKey)

  if (!storage) return null
  try {
    const parsedValue = simpleCamelcaseKeys(JSON.parse(storage))

    if (!parsedValue) return null

    if ('nid' in parsedValue) {
      return <NotePreviewPage data={parsedValue as NoteModel} />
    } else if ('category' in parsedValue || 'categoryId' in parsedValue) {
      return <PostPreviewPage data={parsedValue as PostModel} />
    } else {
      return <PagePreviewPage data={parsedValue as PageModel} />
    }
  } catch {
    return null
  }
}

PreviewPage.getInitialProps = (ctx: any) => {
  setRequestLocale(getLocaleFromContext(ctx))
  return {
    storageKey: ctx.query.storageKey as string,
  }
}
export default PreviewPage
