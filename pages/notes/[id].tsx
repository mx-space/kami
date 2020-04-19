import { faClock, faUser, faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NoteLayout } from 'layouts/NoteLayout'
import { observer } from 'mobx-react'
import { NoteModel, NoteResp } from 'models/dto/note'
import { NextPage } from 'next'
import { useStore } from 'store'
import { Rest } from 'utils/api'
import { relativeTimeFromNow, parseDate } from 'utils/time'
import { useState, useEffect } from 'react'
import RemoveMarkdown from 'remove-markdown'
import Markdown from 'components/MD-render'

interface NoteViewProps {
  data: NoteModel
  prev: Partial<NoteModel>
  next: Partial<NoteModel>
}

const NoteView: NextPage<NoteViewProps> = (props) => {
  const { data, prev, next } = props
  const { title, nid, _id, text, mood, weather } = data
  const { userStore } = useStore()

  const renderMeta = (
    <>
      <FontAwesomeIcon icon={faUser} />
      <span>{userStore.name}</span>
      <FontAwesomeIcon icon={faClock} />
      <span>{relativeTimeFromNow(data.created)}</span>
      <FontAwesomeIcon icon={faBookmark} />
      <span>{data.count.read}</span>
      <svg
        aria-hidden="true"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        height="1em"
        viewBox="0 0 512 512"
      >
        <path
          fill="currentColor"
          d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"
        ></path>
      </svg>
      <span>{data.count.like}</span>
    </>
  )

  const [tips, setTips] = useState(``)
  useEffect(() => {
    const wordCount = RemoveMarkdown(text).length

    setTips(
      `创建于 ${parseDate(data.created, 'YYYY-MM-DD dddd')}, 修改于 ${parseDate(
        data.modified,
        'YYYY-MM-DD dddd',
      )}, 全文字数: ${wordCount}, 阅读次数: ${data.count.read}, 喜欢次数: ${
        data.count.like
      }`,
    )
  }, [text, data.created, data.modified, data.count.read, data.count.like])

  return (
    <NoteLayout title={title} meta={renderMeta} tips={tips}>
      <Markdown value={text} escapeHtml={false}></Markdown>
    </NoteLayout>
  )
}

NoteView.getInitialProps = async ({ query }) => {
  const id = query.id as string
  const { data, prev, next } = await Rest('Note', 'nid').get<NoteResp>(id)
  return { data, prev, next }
}

export default observer(NoteView)
