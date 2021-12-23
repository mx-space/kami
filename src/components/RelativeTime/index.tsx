/*
 * @Author: Innei
 * @Date: 2021-01-26 11:26:43
 * @LastEditTime: 2021-01-26 11:34:32
 * @LastEditors: Innei
 * @FilePath: /web/components/Time/index.tsx
 * @Mark: Coding with Love
 */
import dayjs from 'dayjs'
import { FC, useEffect, useState } from 'react'
import { relativeTimeFromNow } from 'utils'

export const RelativeTime: FC<{ date: Date }> = (props) => {
  // const { date } = props
  const [relative, setRelative] = useState<string>(
    relativeTimeFromNow(props.date),
  )

  useEffect(() => {
    setRelative(relativeTimeFromNow(props.date))
    let timer: any = setInterval(() => {
      setRelative(relativeTimeFromNow(props.date))
    }, 1000)

    if (Math.abs(dayjs(props.date).diff(new Date(), 'd')) > 29) {
      timer = clearInterval(timer)
      setRelative(
        Intl.DateTimeFormat('en-us', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(props.date),
      )
    }
    return () => {
      timer = clearInterval(timer)
    }
  }, [props.date])

  return <>{relative}</>
}
