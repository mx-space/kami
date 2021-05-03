/*
 * @Author: Innei
 * @Date: 2020-05-12 08:54:09
 * @LastEditTime: 2021-03-07 11:12:52
 * @LastEditors: Innei
 * @FilePath: /web/utils/console.ts
 * @Coding with Love
 */
//stackoverflow.com/questions/7798748/find-out-whether-chrome-console-is-open/48287643#48287643
// import throttle from 'lodash/throttle'
// import { isDev } from './utils'
// // import { Manager } from 'browser-detect-devtools'
import Package from './../package.json'
const version = process.env.VERSION || `v${Package.version}` || ''

// export function releaseDevtools() {
//   Manager.stopDevToolMonitoring()
//   Manager.freezeWhenDevToolsOpened(false)
// }
// export function forbiddenDevtools() {
//   if (isDev) {
//     return
//   }
//   let checkStatus

//   const element = new Image()
//   Object.defineProperty(element, 'id', {
//     get: function () {
//       checkStatus = true
//       throw new Error('Dev tools checker')
//     },
//   })
//   let timer: any = setInterval(() => {
//     console.clear()
//     printToConsole()
//   }, 500)
//   requestAnimationFrame(
//     throttle(function check() {
//       checkStatus = false
//       console.dir(element) //Don't delete this line!
//       if (checkStatus) {
//         timer = clearInterval(timer)
//         console.clear()
//         document.body.textContent = '你打开了控制台, 请关闭后刷新'

//         document.body.style.cssText = `
//         background: unset;
//         color: #000;
//         display: flex;
//         position: absolute;
//         top: 0;
//         bottom: 0;
//         left: 0;
//         right: 0;
//         align-items: center;
//         justify-content: center;
//         font-size: 36px;
//         font-weight: 800;
//         padding: 0;
//         margin: 0;
//         `

//         return
//       }

//       requestAnimationFrame(check)
//     }, 30),
//   )
// }

// export function forbiddenDevtools() {
//   if (isDev) {
//     return
//   }

//   Manager.alwaysConsoleClear(false)
//   Manager.freezeWhenDevToolsOpened(true)
//   // Manager.startDevToolMonitoring((isOpened, orientation) => {
//   //   // alert(orientation)

//   //   if (isOpened) {
//   //     // document.body.textContent = '你打开了控制台, 请关闭后刷新'
//   //     // document.body.style.cssText = `
//   //     //         background: #fff;
//   //     //         color: #000;
//   //     //         display: flex;
//   //     //         position: absolute;
//   //     //         top: 0;
//   //     //         bottom: 0;
//   //     //         left: 0;
//   //     //         right: 0;
//   //     //         align-items: center;
//   //     //         justify-content: center;
//   //     //         font-size: 36px;
//   //     //         font-weight: 800;
//   //     //         padding: 0;
//   //     //         margin: 0;
//   //     //         `

//   //     Manager.stopDevToolMonitoring()
//   //     console.clear()
//   //     printToConsole()
//   //   }
//   // })
// }

const motto = `
    This Personal Space Powered By Mix Space.
    Written by TypeScript, Coding with Love.
    --------
    Stay hungry. Stay foolish. --Steve Jobs
    `

export function printToConsole() {
  try {
    if (document.documentElement.firstChild?.nodeType !== Node.COMMENT_NODE) {
      document.documentElement.prepend(document.createComment(motto))
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

    // eslint-disable-next-line no-empty
  } catch {}
}
