import type { NextPage } from 'next'
import Link from 'next/link'
import { TransitionGroup } from 'react-transition-group'

import type {
  CategoryModel,
  CategoryWithChildrenModel,
} from '@mx-space/api-client'
import { BottomUpTransitionView } from '@mx-space/kami-design/components/Transition/bottom-up'

import { wrapperNextPage } from '~/components/app/WrapperNextPage'
import { SEO } from '~/components/biz/Seo'
import { TimelineListWrapper } from '~/components/biz/TimelineListWrapper'
import { ArticleLayout } from '~/components/layouts/ArticleLayout'
import { omit } from '~/utils/_'
import { apiClient } from '~/utils/client'

interface CategoryListViewProps {
  category: CategoryModel
  children: CategoryWithChildrenModel['children']
}

const CategoryListView: NextPage<CategoryListViewProps> = (props) => {
  const { category, children } = props

  return (
    <ArticleLayout
      title={`分类 - ${category.name}`}
      subtitle={
        children.length
          ? `当前共有 ${children.length} 篇文章, 加油！`
          : `这里还有没有内容呢，再接再厉！`
      }
    >
      <SEO title={`分类: ${category.name}`} />
      <article className="article-list">
        <TransitionGroup
          key={category.id}
          appear
          component={TimelineListWrapper}
        >
          {children.map((child, i) => {
            const date = new Date(child.created)

            return (
              <BottomUpTransitionView
                key={child.id}
                timeout={{ enter: 700 + 50 * i }}
                component="li"
              >
                <Link
                  target="_blank"
                  href={`/posts/${category.slug}/${child.slug}`}
                >
                  {child.title}
                </Link>
                <span className={'meta'}>
                  {(date.getMonth() + 1).toString().padStart(2, '0')}/
                  {date.getDate().toString().padStart(2, '0')}/
                  {date.getFullYear()}
                </span>
              </BottomUpTransitionView>
            )
          })}
        </TransitionGroup>
      </article>
    </ArticleLayout>
  )
}

CategoryListView.getInitialProps = async (ctx) => {
  const { query } = ctx

  const { slug } = query as any
  const data = await apiClient.category.getCategoryByIdOrSlug(slug)

  return {
    category: omit({ ...data }, ['children']),
    children: data.children || [],
  }
}

export default wrapperNextPage(CategoryListView)
