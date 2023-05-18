import type { NextPage } from 'next'
import Link from 'next/link'

import type {
  CategoryModel,
  CategoryWithChildrenModel,
} from '@mx-space/api-client'

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
      <Seo title={`分类: ${category.name}`} />
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
  const { query } = ctx

  const { slug } = query as any
  const data = await apiClient.category.getCategoryByIdOrSlug(slug)

  return {
    category: omit({ ...data }, ['children']),
    children: data.children || [],
  }
}

export default wrapperNextPage(CategoryListView)
