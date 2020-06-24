/*
 * @Author: Innei
 * @Date: 2020-05-12 08:54:09
 * @LastEditTime: 2020-06-24 18:45:57
 * @LastEditors: Innei
 * @FilePath: /mx-web/utils/forbidden.ts
 * @Coding with Love
 */

// https://stackoverflow.com/questions/7798748/find-out-whether-chrome-console-is-open
import { message } from 'antd'
import throttle from 'lodash/throttle'

const _message = '嘿, 你打开了控制台, 请不要做一些骚操作哦!'
const showMessage = throttle(() => {
  message.warn(_message)
}, 500)
export function checkDevtools() {
  // if (typeof window === 'undefined') {
  //   return null
  // }
  const CHECK_TOOLS_CHROME = document.createElement('checkDevTools')
  Object.defineProperty(CHECK_TOOLS_CHROME, 'id', {
    get: function () {
      showMessage()
    },
  })
  const proxy = new Proxy(CHECK_TOOLS_CHROME as any, {
    get(target) {
      const id = target.id
      return _message
    },
  })
  // console.log(const CHECK_TOOLS_CHROME)
  console.log(proxy.test)

  const CHECK_TOOLS_OLDER = /x/
  CHECK_TOOLS_OLDER.toString = function () {
    showMessage()
    return ''
  }
  console.log(CHECK_TOOLS_OLDER)
}
