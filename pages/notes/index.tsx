import { observer } from 'mobx-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useStore } from '../../common/store'

// const NotePage: NextPage<{
//   data: NoteModel
//   next: {
//     _id: string
//     nid: number
//     id: string
//   }
// }> = (props) => {
//   const router = useRouter()
//   useEffect(() => {
//     router.push('/notes/[id]', `/notes/${props.data.nid}`, { shallow: true })
//   }, [props.data.nid, router])

//   return <main></main>
// }

// NotePage.getInitialProps = async (ctx) => {
//   const { data, next } = (await Rest('Note').get('latest')) as NoteLastestResp

//   return { data, next }
// }
const NotePage = observer(() => {
  const router = useRouter()
  const { appStore } = useStore()
  useEffect(() => {
    router.replace('/notes/[id]', `/notes/${appStore.noteNid}`, {
      shallow: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <main></main>
})
export default NotePage
