import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Post() {
  const router = useRouter()
  useEffect(() => {
    const query = router.query
    const { slug, page } = query
    router.replace('/posts/[category]/[slug]', `/posts/${page}/${slug}`)
  })

  return <main></main>
}
