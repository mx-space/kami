import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import 'dayjs/locale/zh-cn'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

import { useLocale } from '~/i18n/navigation'
import { relativeTimeFromNow } from '~/utils/time'

const dayjsLocaleMap = { zh: 'zh-cn', en: 'en', ja: 'ja' } as const

export const RelativeTime: FC<{
  date: string | Date
  displayAbsoluteTimeAfterDay?: number
}> = (props) => {
  const locale = useLocale()
  const [relative, setRelative] = useState<string>(
    relativeTimeFromNow(props.date),
  )

  const { displayAbsoluteTimeAfterDay = 29 } = props

  useEffect(() => {
    setRelative(relativeTimeFromNow(props.date))
    let timer: any = setInterval(() => {
      setRelative(relativeTimeFromNow(props.date))
    }, 1000)

    if (
      Math.abs(dayjs(props.date).diff(new Date(), 'd')) >
      displayAbsoluteTimeAfterDay
    ) {
      timer = clearInterval(timer)
      const dayjsLocale = dayjsLocaleMap[locale] ?? 'en'
      setRelative(dayjs(props.date).locale(dayjsLocale).format('LL'))
    }
    return () => {
      timer = clearInterval(timer)
    }
  }, [props.date, displayAbsoluteTimeAfterDay, locale])

  return <>{relative}</>
}
