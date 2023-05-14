import dayjs from 'dayjs'
import React from 'react'

import { RelativeTime } from '~/components/common/RelativeTime'
import { Banner } from '~/components/ui/Banner'

export default (function OutdateNotice({ time }: { time: string | Date }) {
  return dayjs().diff(dayjs(time), 'day') > 60 ? (
    <Banner type="warning" className="mb-10">
      <span className="leading-[1.8]">
        这篇文章上次修改于 <RelativeTime date={time} />
        ，可能部分内容已经不适用，如有疑问可询问作者。
      </span>
    </Banner>
  ) : null
})
