import type { NextPage } from 'next'
import React, {
  Fragment,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import RemoveMarkdown from 'remove-markdown'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { shallow } from 'zustand/shallow'

import type { PageModel } from '@mx-space/api-client'

import { usePageCollection } from '~/atoms/collections/page'
import { getLocaleFromContext, Link, useLocale } from '~/i18n/navigation'
import { setRequestLocale } from '~/utils/client'
import { Seo } from '~/components/app/Seo'
import { wrapperNextPage } from '~/components/app/WrapperNextPage'
import { KamiMarkdown } from '~/components/common/KamiMarkdown'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { ImageSizeMetaContext } from '~/components/ui/Image/context'
import { Loading } from '~/components/ui/Loading'
import {
  useSetHeaderMeta,
  useSetHeaderShare,
} from '~/hooks/app/use-header-meta'
import { useInitialData } from '~/hooks/app/use-initial-data'
import { useJumpToSimpleMarkdownRender } from '~/hooks/app/use-jump-to-render'
import { imagesRecord2Map } from '~/utils/images'
import { appendStyle } from '~/utils/load-script'
import { springScrollToTop } from '~/utils/spring'

import styles from './index.module.css'

const CommentLazy = lazy(() =>
  import('~/components/widgets/Comment').then((mo) => ({
    default: mo.CommentLazy,
  })),
)

const PageView: PageOnlyProps = (props) => {
  const t = useTranslations('page')
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
          <KamiMarkdown value={text} toc />
        </article>
      </ImageSizeMetaContext.Provider>
      <div className={styles['pagination']}>
        <div>
          {hasPrev && (
            <Fragment>
              <Link
                href={`/${pages[indexInPages - 1].slug}`}
                className="flex flex-col justify-end"
              >
                <h2 className="text-primary">{t('review')}</h2>
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
                <h2 className="text-primary">{t('continue')}</h2>
                <p className="text-right">{pages[indexInPages + 1].title}</p>
              </Link>
            </Fragment>
          )}
        </div>
      </div>
      <Suspense fallback={null}>
        <CommentLazy
          key={page.id}
          id={page.id}
          allowComment={page.allowComment ?? true}
        />
      </Suspense>
    </ArticleLayout>
  )
}

const NextPageView: NextPage<PageModel> = (props) => {
  const { id } = props as any
  const router = useRouter()
  const locale = useLocale()
  const pageId = usePageCollection((state) => state.data.get(id)?.id)

  useEffect(() => {
    const slug = router.query.page as string
    if (slug) {
      usePageCollection.getState().fetchBySlug(slug, { force: true })
    }
  }, [locale, router.query.page])

  if (!pageId) {
    usePageCollection.getState().add(props)
    return <Loading />
  }

  return <PageView id={id} />
}

NextPageView.getInitialProps = async (ctx) => {
  setRequestLocale(getLocaleFromContext(ctx))
  const { page: slug } = ctx.query
  const data = await usePageCollection.getState().fetchBySlug(slug as string)
  return data
}

export default wrapperNextPage(NextPageView)
