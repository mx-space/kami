/*
 * @Author: Innei
 * @Date: 2020-09-17 14:02:24
 * @LastEditTime: 2021-01-26 11:33:00
 * @LastEditors: Innei
 * @FilePath: /web/components/Outdate/index.tsx
 * @Mark: Coding with Love
 */
import { RelativeTime } from 'components/Time'
import dayjs from 'dayjs'
import React from 'react'

export default (function OutdateNotice({ time }: { time: string | Date }) {
  return dayjs().diff(dayjs(time), 'day') > 60 ? (
    <blockquote>
      这篇文章上次修改于 <RelativeTime date={new Date(time)} />
      ，可能其部分内容已经发生变化，如有疑问可询问作者。
    </blockquote>
  ) : null
})
