import { Link } from '~/i18n/navigation'
import { memo } from 'react'
import { useTranslations } from 'next-intl'
import { shallow } from 'zustand/shallow'

import { usePostCollection } from '~/atoms/collections/post'
import { Divider } from '~/components/ui/Divider'

export const PostRelated = memo<{ id: string }>((props) => {
  const t = useTranslations('post')
  const post = usePostCollection((state) => state.data.get(props.id), shallow)
  if (!post) {
    return null
  }

  if (!post.related?.length) {
    return null
  }
  return (
    <div data-hide-print>
      <Divider className="w-46 ml-auto mr-auto" />
      <h3 className="text-lg font-medium">
        <span>{t('related')}</span>
      </h3>
      <ul>
        {post.related.map((post) => {
          return (
            <li key={post.id}>
              <Link
                href={`/posts/${post.category.slug}/${post.slug}`}
                className="underline-current underline-dashed leading-10 underline"
              >
                {post.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
})
