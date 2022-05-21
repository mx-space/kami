import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const RedirectView: NextPage = () => {
  const router = useRouter()
  useEffect(() => {
    router.replace('/notes/latest')
  }, [])

  return null
}

RedirectView.getInitialProps = async (ctx) => {
  const { res } = ctx
  if (!res) {
    return {}
  }
  res
    .writeHead(301, {
      Location: `/notes/latest`,
    })
    .end()

  return {}
}

export default RedirectView
