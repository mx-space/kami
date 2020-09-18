import { message } from 'utils/message'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { observer } from 'utils/mobx'
import { useStore } from '../../common/store'
import { Rest } from '../../utils/api'

const NotePage = observer(() => {
  const router = useRouter()
  const { appStore } = useStore()
  useEffect(() => {
    message.success('正在跳往至最新, 请等待')
    if (appStore.noteNid) {
      router.replace('/notes/[id]', `/notes/${appStore.noteNid}`, {
        shallow: true,
      })
    } else {
      Rest('Note')
        .get('latest')
        .then(({ data }: any) => {
          router.push('/notes/[id]', `/notes/${data.nid}`, {
            shallow: true,
          })
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <main></main>
})
export default NotePage
