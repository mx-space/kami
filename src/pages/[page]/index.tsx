import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { Fragment, useEffect, useMemo, useRef } from 'react'
import RemoveMarkdown from 'remove-markdown'
import { shallow } from 'zustand/shallow'

import { Loading } from '@mx-space/kami-design'
import { ImageSizeMetaContext } from '@mx-space/kami-design/contexts/image-size'

import { usePageCollection } from '~/atoms/collections/page'
import { wrapperNextPage } from '~/components/app/WrapperNextPage'
import { Seo } from '~/components/biz/Seo'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { Markdown } from '~/components/universal/Markdown'
import { useSetHeaderMeta, useSetHeaderShare } from '~/hooks/use-header-meta'
import { useInitialData } from '~/hooks/use-initial-data'
import { useJumpToSimpleMarkdownRender } from '~/hooks/use-jump-to-render'
import { imagesRecord2Map } from '~/utils/images'
import { appendStyle } from '~/utils/load-script'
import { springScrollToTop } from '~/utils/spring'

import styles from './index.module.css'

const CommentLazy = dynamic(() =>
  import('~/components/widgets/Comment').then((mo) => mo.CommentLazy),
)

const PageView: PageOnlyProps = (props) => {
  const page = usePageCollection((state) => state.data.get(props.id), shallow)!
  const { title, subtitle, text } = page

  useEffect(() => {
    if (page.meta?.style) {
      const $style = appendStyle(page.meta.style)

      return () => {
        $style && $style.remove()
      }
    }
  }, [page.meta?.style])

  useSetHeaderMeta(page.title, page.subtitle || '')
  useSetHeaderShare(page.title)
  useJumpToSimpleMarkdownRender(page.id)

  useEffect(() => {
    springScrollToTop()
  }, [props.id])
  const { pageMeta } = useInitialData()
  const pages = useMemo(() => pageMeta || [], [pageMeta])
  const indexInPages = pages.findIndex((i) => i.title == page.title)
  const n = pages.length
  const hasNext = indexInPages + 1 < n
  const hasPrev = indexInPages - 1 >= 0
  return (
    <ArticleLayout title={title} subtitle={subtitle} id={props.id} type="page">
      <Seo
        title={title}
        openGraph={
          useRef<{
            type: 'article'
          }>({ type: 'article' }).current
        }
        description={RemoveMarkdown(text).slice(0, 100).replace('\n', '')}
      />
      <ImageSizeMetaContext.Provider
        value={useMemo(
          () => imagesRecord2Map(page.images || []),
          [page.images],
        )}
      >
        <article>
          <h1 className="sr-only">{title}</h1>
          <Markdown value={text} toc />
        </article>
      </ImageSizeMetaContext.Provider>
      {useMemo(
        () => (
          <div className={styles['pagination']}>
            <div>
              {hasPrev && (
                <Fragment>
                  <Link
                    href={`/${pages[indexInPages - 1].slug}`}
                    className="flex flex-col justify-end"
                  >
                    <h2 className="text-indigo-400">回顾一下：</h2>
                    <p className="text-left">{pages[indexInPages - 1].title}</p>
                  </Link>
                </Fragment>
              )}
            </div>
            <div>
              {hasNext && (
                <Fragment>
                  <Link
                    href={`/${pages[indexInPages + 1].slug}`}
                    className="flex flex-col justify-end"
                  >
                    <h2 className="text-indigo-400">继续了解：</h2>
                    <p className="text-right">
                      {pages[indexInPages + 1].title}
                    </p>
                  </Link>
                </Fragment>
              )}
            </div>
          </div>
        ),
        [hasNext, hasPrev, indexInPages, pages],
      )}
      <CommentLazy
        key={page.id}
        id={page.id}
        allowComment={page.allowComment ?? true}
      />
    </ArticleLayout>
  )
}

const NextPageView: NextPage = (props) => {
  const { id } = props as any
  const page = usePageCollection((state) => state.data.get(id), shallow)

  if (!page) {
    return <Loading />
  }

  return <PageView id={id} />
}

NextPageView.getInitialProps = async (ctx) => {
  const { page: slug } = ctx.query
  const data = await usePageCollection.getState().fetchBySlug(slug as string)
  return data
}

export default wrapperNextPage(NextPageView)
