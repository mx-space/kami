import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)
dayjs.extend(LocalizedFormat)
dayjs.locale('zh-cn')

export enum DateFormat {
  'MMM DD YYYY',
  'HH:mm',
  'LLLL',
  'H:mm:ss A',
  'YYYY-MM-DD',
  'YYYY-MM-DD dddd',
  'YYYY-MM-DD ddd',
  'MM-DD ddd',
}

export const parseDate = (
  time: string | Date,
  format: keyof typeof DateFormat,
) => dayjs(time).format(format)

export const relativeTimeFromNow = (
  time: Date | string,
  withoutSuffix?: boolean | undefined,
) => dayjs(new Date(time)).fromNow(withoutSuffix)

export default { parseDate, relativeTimeFromNow }
