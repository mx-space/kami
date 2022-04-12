import { ArticleLayout } from 'components/layouts/ArticleLayout'
import { buildStoreDataLoadableView } from 'components/universal/LoadableView'
import { Markdown } from 'components/universal/Markdown'
import { CommentLazy } from 'components/widgets/Comment'
import { useHeaderMeta, useHeaderShare } from 'hooks/use-header-meta'
import { useInitialData } from 'hooks/use-initial-data'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import React, { Fragment, useEffect, useMemo } from 'react'
import RemoveMarkdown from 'remove-markdown'
import { store, useStore } from 'store'
import { noop } from 'utils'
import { imagesRecord2Map } from 'utils/images'
import { springScrollToTop } from 'utils/spring'

import { PageModel } from '@mx-space/api-client'

import { Seo } from '../../components/universal/Seo'
import { ImageSizeMetaContext } from '../../context/image-size'
import styles from './index.module.css'

const PageView: PageOnlyProps = observer((props) => {
  const { pageStore } = useStore()
  const page = pageStore.get(props.id) || (noop as PageModel)
  const { title, subtitle, text } = page

  useHeaderMeta(page.title, page.subtitle || '')
  useHeaderShare(page.title, page.text)

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
        openGraph={{ type: 'article' }}
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
          <Markdown value={text} escapeHtml={false} toc />
        </article>
      </ImageSizeMetaContext.Provider>
      {useMemo(
        () => (
          <div className={styles['pagination']}>
            <div>
              {hasPrev && (
                <Fragment>
                  <Link href={`/${pages[indexInPages - 1].slug}`}>
                    <a className="flex flex-col justify-end">
                      <h2 className="text-indigo-400">回顾一下：</h2>
                      <p className="text-left">
                        {pages[indexInPages - 1].title}
                      </p>
                    </a>
                  </Link>
                </Fragment>
              )}
            </div>
            <div>
              {hasNext && (
                <Fragment>
                  <Link href={`/${pages[indexInPages + 1].slug}`}>
                    <a className="flex flex-col justify-end">
                      <h2 className="text-indigo-400">继续了解：</h2>
                      <p className="text-right">
                        {pages[indexInPages + 1].title}
                      </p>
                    </a>
                  </Link>
                </Fragment>
              )}
            </div>
          </div>
        ),
        [hasNext, hasPrev, indexInPages, pages],
      )}
      <CommentLazy
        type="Page"
        id={page.id}
        allowComment={page.allowComment ?? true}
      />
    </ArticleLayout>
  )
})
const PP = buildStoreDataLoadableView(store.pageStore, PageView)
PP.getInitialProps = async (ctx) => {
  const { page: slug } = ctx.query
  const data = await store.pageStore.fetchBySlug(slug as string)
  return data
}

export default PP
