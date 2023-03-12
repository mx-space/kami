import Link from 'next/link'
import { memo } from 'react'

import { Divider } from '@mx-space/kami-design/components/Divider'

import { usePostCollection } from '~/atoms/collections/post'

export const PostRelated = memo<{ id: string }>((props) => {
  const post = usePostCollection((state) => state.data.get(props.id))
  if (!post) {
    return null
  }

  if (!post.related?.length) {
    return null
  }
  return (
    <div data-hide-print>
      <Divider className="ml-auto mr-auto w-46" />
      <h3 className="font-medium text-lg">
        <span>相关文章</span>
      </h3>
      <ul>
        {post.related.map((post) => {
          return (
            <li key={post.id}>
              <Link
                href={`/posts/${post.category.slug}/${post.slug}`}
                className="leading-10 underline-current underline underline-dashed"
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
