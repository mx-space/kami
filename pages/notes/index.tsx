import { NoteLastestResp, NoteModel } from 'models/dto/note'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Rest } from 'utils/api'

const NotePage: NextPage<{
  data: NoteModel
  next: {
    _id: string
    nid: number
    id: string
  }
}> = (props) => {
  const router = useRouter()
  useEffect(() => {
    router.push('/notes/[id]', `/notes/${props.data.nid}`, { shallow: true })
  }, [props.data.nid, router])

  return <main></main>
}

NotePage.getInitialProps = async (ctx) => {
  const { data, next } = (await Rest('Note').get('latest')) as NoteLastestResp

  return { data, next }
}

export default NotePage
