import { PageModel } from '@mx-space/api-client'
import { useHeaderMeta, useHeaderShare } from 'common/hooks/use-header-meta'
import { useInitialData } from 'common/hooks/use-initial-data'
import { pageStore } from 'common/store'
import { ArticleLayout } from 'layouts/ArticleLayout'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import React, { Fragment, useEffect, useMemo } from 'react'
import RemoveMarkdown from 'remove-markdown'
import { noop } from 'utils'
import { imagesRecord2Map } from 'utils/images'
import { CommentLazy } from 'views/Comment'
import { buildStoreDataLoadableView } from 'views/LoadableView'
import { Markdown } from 'views/Markdown'
import { ImageSizeMetaContext } from '../../common/context/image-size'
import { Seo } from '../../components/SEO'
import styles from './index.module.css'

const PageView: PageOnlyProps = observer((props) => {
  const page = pageStore.get(props.id) || (noop as PageModel)
  const { title, subtitle, text } = page

  useHeaderMeta(page.title, page.subtitle || '')
  useHeaderShare(page.title, page.text)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
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
        <Markdown value={text} escapeHtml={false} toc />
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
const PP = buildStoreDataLoadableView(pageStore, PageView)
PP.getInitialProps = async (ctx) => {
  const { page: slug } = ctx.query
  const data = await pageStore.fetchBySlug(slug as string)
  return data
}

export default PP
