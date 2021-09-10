import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { observer } from 'utils/mobx'

const NotePage = observer(() => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/notes/latest', undefined, {
      shallow: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <main></main>
})
export default NotePage
