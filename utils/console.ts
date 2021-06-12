/*
 * @Author: Innei
 * @Date: 2020-05-12 08:54:09
 * @LastEditTime: 2021-06-12 19:30:46
 * @LastEditors: Innei
 * @FilePath: /web/utils/console.ts
 * @Coding with Love
 */
import type { DevtoolsDetectorListener } from 'devtools-detector/lib/types/devtools-detector-listener.type'
import Package from './../package.json'
import { isDev } from './utils'
const version = process.env.VERSION || `v${Package.version}` || ''

const handler: DevtoolsDetectorListener = async (isOpen, detail) => {
  if (isDev) {
    return
  }
  if (isOpen) {
    const { removeListener, stop } = await import('devtools-detector')

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
  const { launch, addListener } = await import('devtools-detector')
  if (isDev) {
    return
  }
  addListener(handler)

  launch()
}

export const releaseDevtool = async () => {
  const { stop } = await import('devtools-detector')
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
      `%c Kami ${(<any>window).version} %c https://innei.ren `,
      'color: #fff; margin: 1em 0; padding: 5px 0; background: #27ae60;',
      'margin: 1em 0; padding: 5px 0; background: #efefef;',
    )

    // eslint-disable-next-line no-empty
  } catch {}
}
