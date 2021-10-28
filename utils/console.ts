/*
 * @Author: Innei
 * @Date: 2020-05-12 08:54:09
 * @LastEditTime: 2021-06-27 17:06:44
 * @LastEditors: Innei
 * @FilePath: /web/utils/console.ts
 * @Coding with Love
 */
import {
  DevtoolsDetectorListener,
  removeListener,
  stop,
} from '@innei/devtools-detector'
import Package from './../package.json'
import { isDev, isServerSide } from './utils'
const version = `v${Package.version}` || ''

const isSpiderBot = () => {
  if (isServerSide()) {
    return false
  }

  const ua = navigator.userAgent
  if (/bot/.test(ua.toLowerCase())) {
    return true
  }
  return false
}
// for debug
const devTest = false
const handler: DevtoolsDetectorListener = async (isOpen, detail) => {
  if ((isDev && !devTest) || isSpiderBot()) {
    return
  }
  if (isOpen) {
    removeListener(handler)
    stop()

    document.body.innerHTML =
      '<h1>你打开了控制台, 请关闭后刷新</h1><p><small>' +
      `</small></p>` +
      `<p><small>${detail?.checkerName || ''} <br /> ${
        navigator.userAgent
      }</small></p>`
    document.body.style.cssText = `
background: #fff;
color: #000;
display: flex;
position: absolute;
top: 0;
bottom: 0;
left: 0;
right: 0;
align-items: center;
justify-content: center;
flex-direction: column;
padding: 5rem;
margin: 0;
text-align: center;
`

    console.clear()
    printToConsole()
  }
}
export async function devtoolForbidden() {
  if (isDev && !devTest) {
    return
  }
  // addListener(handler)
  // launch()
}

export const releaseDevtool = async () => {
  stop()
}

const motto = `
This Personal Space Powered By Mix Space.
Written by TypeScript, Coding with Love.
--------
Stay hungry. Stay foolish. --Steve Jobs
`

export function printToConsole() {
  try {
    if (document.firstChild?.nodeType !== Node.COMMENT_NODE) {
      document.prepend(document.createComment(motto))
    }

    console.log(
      '%c Kico Style %c https://paugram.com ',
      'color: #fff; margin: 1em 0; padding: 5px 0; background: #3498db;',
      'margin: 1em 0; padding: 5px 0; background: #efefef;',
    )
    console.log(
      `%c Mix Space ${version} %c https://innei.ren `,
      'color: #fff; margin: 1em 0; padding: 5px 0; background: #2980b9;',
      'margin: 1em 0; padding: 5px 0; background: #efefef;',
    )
    console.log(
      `%c Kami ${window.version} %c https://innei.ren `,
      'color: #fff; margin: 1em 0; padding: 5px 0; background: #27ae60;',
      'margin: 1em 0; padding: 5px 0; background: #efefef;',
    )

    // eslint-disable-next-line no-empty
  } catch {}
}
