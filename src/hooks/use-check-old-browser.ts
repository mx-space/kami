import { useCallback } from 'react'
import { message } from 'react-message-popup'

export const useCheckOldBrowser = () => {
  const checkBrowser = useCallback(() => {
    const { isOld, msg: errMsg } = checkOldBrowser()
    if (isOld) {
      const msg = '欧尼酱, 乃的浏览器太老了, 更新一下啦（o´ﾟ□ﾟ`o）'
      alert(msg)
      message.warn(msg, Infinity)
      class BrowserTooOldError extends Error {
        constructor() {
          super(errMsg)
        }
      }

      throw new BrowserTooOldError()
    }
  }, [])

  return {
    check: checkBrowser,
  }
}

function checkOldBrowser() {
  const ua = window.navigator.userAgent
  const isIE = (function () {
    const msie = ua.indexOf('MSIE') // IE 10 or older
    const trident = ua.indexOf('Trident/') // IE 11

    return msie > 0 || trident > 0
  })()
  const isOld: boolean = (() => {
    if (isIE) {
      alert(
        '欧尼酱, 乃真的要使用 IE 浏览器吗, 不如换个 Chrome 好不好嘛（o´ﾟ□ﾟ`o）',
      )
      location.href = 'https://www.google.cn/chrome/'
      return true
    }
    // check build-in methods
    const ObjectMethods = ['fromEntries', 'entries']
    const ArrayMethods = ['flat']
    if (
      !window.Reflect ||
      !(
        ObjectMethods.every((m) => Reflect.has(Object, m)) &&
        ArrayMethods.every((m) => Reflect.has(Array.prototype, m))
      ) ||
      !window.requestAnimationFrame ||
      !window.Proxy ||
      !window.IntersectionObserver ||
      !window.ResizeObserver ||
      !window.Intl ||
      typeof globalThis === 'undefined' ||
      typeof Set === 'undefined' ||
      typeof Map === 'undefined'
    ) {
      return true
    }

    return false
  })()
  if (isOld) {
    window.alert('欧尼酱, 乃的浏览器太老了, 更新一下啦（o´ﾟ□ﾟ`o）')
    return {
      isOld: true,
      msg: `User browser is too old. UA: ${ua}`,
    }
  }

  return { isOld: false, msg: '' }
}
