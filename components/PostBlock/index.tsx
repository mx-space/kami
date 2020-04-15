import Markdown from 'components/MD-render'
import React, { FC } from 'react'
import { parseDate } from 'utils/time'

interface Props {
  date: Date | string
  title: string
  text: string
}

export const PostBlock: FC<Props> = ({ date, title, text }) => {
  const parsedTime = parseDate(date, 'YYYY-MM-DD ddd')
  const [d, week] = parsedTime.split(' ')
  return (
    <>
      <h1>
        {d}
        <small>（{week}）</small>
      </h1>
      <div className="note-item">
        <article className="note-content">
          <Markdown value={text} />
        </article>
      </div>
    </>
  )
}
