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
