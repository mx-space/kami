import dayjs from 'dayjs'
import React from 'react'
import { useTranslations } from 'next-intl'

import { RelativeTime } from '~/components/common/RelativeTime'
import { Banner } from '~/components/ui/Banner'

export default (function OutdateNotice({ time }: { time: string | Date }) {
  const t = useTranslations('post')
  return dayjs().diff(dayjs(time), 'day') > 60 ? (
    <Banner type="warning" className="mb-10">
      <span className="leading-[1.8]">
        {t('outdatePrefix')}
        <RelativeTime date={time} />
        {t('outdateSuffix')}
      </span>
    </Banner>
  ) : null
})
