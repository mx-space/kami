import dayjs from 'dayjs'
import Cookies from 'js-cookie'

export const TokenKey = 'mx-token'

export function normalizeToken(token?: string | null): string | null {
  if (!token || typeof token !== 'string') {
    return null
  }
  const normalized = token.trim().replace(/^Bearer\s+/i, '')
  return normalized.length ? normalized : null
}

export function getToken(): string | null {
  const token = Cookies.get(TokenKey)
  return normalizeToken(token)
}

export function getAuthorizationToken(): string | null {
  const token = getToken()
  return token ? `Bearer ${token}` : null
}

export function setToken(token: string) {
  const normalized = normalizeToken(token)
  if (!normalized) {
    return
  }
  return Cookies.set(TokenKey, normalized, {
    expires: 14,
  })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
const LikePrefix = 'mx-like'
export function setLikeId(id: string) {
  const has = getLikes()
  if (!has) {
    Cookies.set(LikePrefix, JSON.stringify([id]), { expires: getTomorrow() })
  } else {
    if (isLikedBefore(id)) {
      return
    }
    Cookies.set(
      LikePrefix,
      JSON.stringify((JSON.parse(has) as string[]).concat(id)),
      { expires: getTomorrow() },
    )
  }
}

function getLikes() {
  return decodeURIComponent(Cookies.get(LikePrefix) ?? '')
}

export function isLikedBefore(id: string) {
  const has = getLikes()

  if (!has) {
    return false
  }
  const list = JSON.parse(has) as string[]

  return list.includes(id)
}

function getTomorrow() {
  return dayjs().add(1, 'd').set('h', 2).set('m', 0).toDate()
}
