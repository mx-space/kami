import { useCallback } from 'react'
import { UAParser } from 'ua-parser-js'
import { message } from 'utils/message'

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
  const parser = new UAParser(window.navigator.userAgent)
  const browser = parser.getBrowser()
  const isOld: boolean = (() => {
    if (browser.name === 'IE') {
      alert(
        '欧尼酱, 乃真的要使用 IE 浏览器吗, 不如换个 Chrome 好不好嘛（o´ﾟ□ﾟ`o）',
      )
      location.href = 'https://www.google.com/chrome/'
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
    const { name: osName, version: osVersion } = parser.getOS()

    return {
      isOld: true,
      msg: `User browser(${browser.name} ${browser.version}) is too old. OS: ${osName}/${osVersion}`,
    }
  }

  return { isOld: false, msg: '' }
}
