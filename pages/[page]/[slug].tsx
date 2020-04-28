import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Post() {
  const router = useRouter()
  useEffect(() => {
    const query = router.query
    const { slug } = query
    router.push({ pathname: '/posts/[slug]' }, `/posts/${slug}`)
  })

  return <main></main>
}
