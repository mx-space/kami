import dayjs from 'dayjs'
import { relativeTimeFromNow } from 'utils/time'

export default (function OutdateNotice({ time }: { time: string | Date }) {
  const relative = relativeTimeFromNow(time)

  return dayjs().diff(dayjs(time), 'day') > 60 ? (
    <blockquote>
      这篇文章上次修改于 {relative}
      ，可能其部分内容已经发生变化，如有疑问可询问作者。
    </blockquote>
  ) : null
})
