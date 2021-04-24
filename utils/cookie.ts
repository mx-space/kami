import dayjs from 'dayjs'
import Cookies from 'js-cookie'

const TokenKey = 'mx-web-token'

export function getToken(): string | null {
  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey) as string)
    : null
}

export function setToken(token: string, expires: number | Date) {
  if (!token) {
    return
  }
  return Cookies.set(TokenKey, JSON.stringify(token), { expires })
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
  // Cookies.set(LikePrefix + id, )
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
  console.log(list, id, list.includes(id))

  return list.includes(id)
}

function getTomorrow() {
  return dayjs().add(1, 'd').set('h', 2).set('m', 0).toDate()
}
