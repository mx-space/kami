import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

import type {
  CategoryModel,
  CategoryWithChildrenModel,
} from '@mx-space/api-client'

import { getLocaleFromContext, Link, useLocale } from '~/i18n/navigation'
import { setRequestLocale } from '~/utils/client'
import { Seo } from '~/components/app/Seo'
import { wrapperNextPage } from '~/components/app/WrapperNextPage'
import { TimelineListWrapper } from '~/components/in-page/Timeline/TimelineListWrapper'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { BottomToUpTransitionView } from '~/components/ui/Transition/BottomToUpTransitionView'
import { omit } from '~/utils/_'
import { apiClient } from '~/utils/client'

interface CategoryListViewProps {
  category: CategoryModel
  children: CategoryWithChildrenModel['children']
}

const CategoryListView: NextPage<CategoryListViewProps> = (props) => {
  const t = useTranslations('category')
  const locale = useLocale()
  const [category, setCategory] = useState(props.category)
  const [children, setChildren] = useState(props.children)
  const slug = props.category.slug

  useEffect(() => {
    setCategory(props.category)
    setChildren(props.children)
  }, [props.category?.id])

  useEffect(() => {
    apiClient.category.getCategoryByIdOrSlug(slug).then((data) => {
      setCategory(omit({ ...data }, ['children']) as CategoryModel)
      setChildren(data.children || [])
    })
  }, [locale, slug])

  return (
    <ArticleLayout
      title={t('title', { name: category.name })}
      subtitle={
        children.length
          ? t('subtitleWithCount', { count: children.length })
          : t('subtitleEmpty')
      }
    >
      <Seo title={t('seoTitle', { name: category.name })} />
      <article className="article-list">
        <TimelineListWrapper>
          {children.map((child, i) => {
            const date = new Date(child.created)

            return (
              <BottomToUpTransitionView
                key={child.id}
                timeout={{ enter: 700 + 50 * i }}
                as="li"
                className="flex min-w-0 items-center justify-between"
              >
                <Link
                  target="_blank"
                  href={`/posts/${category.slug}/${child.slug}`}
                  className="min-w-0 truncate"
                >
                  {child.title}
                </Link>
                <span className="meta">
                  {(date.getMonth() + 1).toString().padStart(2, '0')}/
                  {date.getDate().toString().padStart(2, '0')}/
                  {date.getFullYear()}
                </span>
              </BottomToUpTransitionView>
            )
          })}
        </TimelineListWrapper>
      </article>
    </ArticleLayout>
  )
}

CategoryListView.getInitialProps = async (ctx) => {
  setRequestLocale(getLocaleFromContext(ctx))
  const { query } = ctx
  const { slug } = query as any
  const data = await apiClient.category.getCategoryByIdOrSlug(slug)

  return {
    category: omit({ ...data }, ['children']),
    children: data.children || [],
  }
}

export default wrapperNextPage(CategoryListView)
