import { observer } from 'mobx-react-lite'
import Link from 'next/link'

import { Divider } from '~/components/universal/Divider'
import { store } from '~/store'

export const PostRelated = observer<{ id: string }>((props) => {
  const posts = store.postStore
  const post = posts.get(props.id)
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
              <Link href={`/posts/${post.category.slug}/${post.slug}`}>
                <a className="leading-10 underline-current underline underline-dashed">
                  {post.title}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
})
