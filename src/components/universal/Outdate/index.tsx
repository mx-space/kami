import dayjs from 'dayjs'
import React from 'react'

import { RelativeTime } from '~/components/universal/RelativeTime'

export default (function OutdateNotice({ time }: { time: string | Date }) {
  return dayjs().diff(dayjs(time), 'day') > 60 ? (
    <blockquote className="mb-20">
      这篇文章上次修改于 <RelativeTime date={new Date(time)} />
      ，可能其部分内容已经发生变化，如有疑问可询问作者。
    </blockquote>
  ) : null
})
