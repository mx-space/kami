import dayjs from 'dayjs'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

import { relativeTimeFromNow } from '~/utils/time'

export const RelativeTime: FC<{
  date: string | Date
  displayAbsoluteTimeAfterDay?: number
}> = (props) => {
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
      setRelative(
        Intl.DateTimeFormat('en-us', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(
          typeof props.date === 'string' ? new Date(props.date) : props.date,
        ),
      )
    }
    return () => {
      timer = clearInterval(timer)
    }
  }, [props.date, displayAbsoluteTimeAfterDay])

  return <>{relative}</>
}
