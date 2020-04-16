import { NextPage } from 'next'
import { Rest } from 'utils/api'
import { NoteLastestResp, NoteModel } from 'models/dto/note'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

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
  }, [])

  return null
}

NotePage.getInitialProps = async () => {
  const { data, next } = (await Rest('Note').get('latest')) as NoteLastestResp
  return { data, next }
}

export default NotePage
