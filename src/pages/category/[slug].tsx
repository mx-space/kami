import { CategoryModel, CategoryWithChildrenModel } from '@mx-space/api-client'
import omit from 'lodash/omit'
import { NextPage } from 'next'
import Link from 'next/link'
import { apiClient } from 'utils/client'
import { QueueAnim } from '../../components/Anime'
import { SEO } from '../../components/SEO'
import { ArticleLayout } from '../../layouts/ArticleLayout'

interface CategoryListViewProps {
  category: CategoryModel
  children: CategoryWithChildrenModel['children']
}

const CategoryListView: NextPage<CategoryListViewProps> = (props) => {
  const { category, children } = props

  return (
    <ArticleLayout
      title={'分类 - ' + category.name}
      subtitle={'当前共有' + children.length + '篇文章, 加油!'}
    >
      <SEO title={'分类: ' + category.name} />
      <article className="post-content kami-note article-list">
        <ul>
          <QueueAnim
            delay={700}
            forcedReplay
            appear
            type={['right', 'left']}
            interval={[100, 200]}
            duration={[500, 2000]}
            ease={['easeOutBack', 'easeInOutCirc']}
            leaveReverse
          >
            {children.map((child) => {
              const date = new Date(child.created)

              return (
                <li key={child.id}>
                  <Link
                    href={'/posts/[category]/[slug]'}
                    as={`/posts/${category.slug}/${child.slug}`}
                  >
                    <a>{child.title}</a>
                  </Link>
                  <span className={'meta'}>
                    {(date.getMonth() + 1).toString().padStart(2, '0')}/
                    {date.getDate().toString().padStart(2, '0')}/
                    {date.getFullYear()}
                  </span>
                </li>
              )
            })}
          </QueueAnim>
        </ul>
      </article>
    </ArticleLayout>
  )
}

CategoryListView.getInitialProps = async (ctx) => {
  const { query } = ctx

  const { slug } = query as any
  const data = await apiClient.category.getCategoryByIdOrSlug(slug)

  return {
    category: omit(data, ['children']),
    children: data.children || [],
  }
}

export default CategoryListView
