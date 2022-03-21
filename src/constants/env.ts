import { isDev, isServerSide } from 'utils/utils'
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_APIURL || getUrl()

export const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || ''

function getUrl() {
  const postfix = isDev ? '/api' : '/api/v2'
  if (isServerSide()) {
    return `http://localhost:2323${postfix}`
  }
  return postfix
}
