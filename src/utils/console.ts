import type { DevtoolsDetectorListener } from 'devtools-detector'

import Package from '~/../package.json'

import { isDev, isServerSide } from './env'

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
const devTest = true
const handler: DevtoolsDetectorListener = async (isOpen, detail) => {
  if ((isDev && !devTest) || isSpiderBot()) {
    return
  }
  const { removeListener, stop } = await import('devtools-detector')

  if (isOpen) {
    removeListener(handler)
    stop()

    document.body.innerHTML = '<h1>お可愛いこと。</h1>'
    console.log(detail)

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
  const { addListener, launch } = await import('devtools-detector')
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
      '%c Paul Style %c https://paugram.com ',
      'color: #fff; margin: 1em 0; padding: 5px 0; background: #3498db;',
      'margin: 1em 0; padding: 5px 0; background: #efefef;',
    )
    console.log(
      `%c Mix Space %c https://innei.ren `,
      'color: #fff; margin: 1em 0; padding: 5px 0; background: #2980b9;',
      'margin: 1em 0; padding: 5px 0; background: #efefef;',
    )
    console.log(
      `%c Kami ${version} %c https://innei.ren `,
      'color: #fff; margin: 1em 0; padding: 5px 0; background: #39C5BB;',
      'margin: 1em 0; padding: 5px 0; background: #efefef;',
    )

    // eslint-disable-next-line no-empty
  } catch {}
}
