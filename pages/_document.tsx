/*
 *           佛曰:
 *                   写字楼里写字间，写字间里程序员；
 *                   程序人员写程序，又拿程序换酒钱。
 *                   酒醒只在网上坐，酒醉还来网下眠；
 *                   酒醉酒醒日复日，网上网下年复年。
 *                   但愿老死电脑间，不愿鞠躬老板前；
 *                   奔驰宝马贵者趣，公交自行程序员。
 *                   别人笑我忒疯癫，我笑自己命太贱；
 *                   不见满街漂亮妹，哪个归得程序员？
 *
 * @Author: Innei
 * @Date: 2020-04-29 17:27:02
 * @LastEditTime: 2021-01-09 22:36:39
 * @LastEditors: Innei
 * @FilePath: /web/pages/_document.tsx
 * @MIT
 */

import configs from 'configs'
import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import Package from 'package.json'
import { GA_TRACKING_ID } from '../utils/gtag'
const { version } = Package

export default class MyDocument extends Document<{ ua: string }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    const ua = ctx.req?.headers['user-agent']
    return { ...initialProps, ua }
  }

  render() {
    return (
      <Html>
        <Head lang={'zh-cn'}>
          <meta charSet="UTF-8" />
          <link rel="manifest" href="/manifest.json" />

          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="application-name" content="静かな森" />
          <meta name="apple-mobile-web-app-title" content="静かな森" />
          <meta name="msapplication-tooltip" content="静かな森" />
          <meta name="theme-color" content="#27ae60" />
          <meta name="msapplication-navbutton-color" content="#27ae60" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black" />

          <meta name="msapplication-starturl" content="/" />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-icon-180.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="/apple-icon-167.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/apple-icon-152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/apple-icon-120.png"
          />
          <link
            data-n-head="ssr"
            rel="apple-touch-startup-image"
            href="/apple-icon-180.png"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          <link
            href="https://fonts.googleapis.com/css?family=Noto+Serif+SC"
            rel="stylesheet"
            type="text/css"
          />
          <link
            href="https://cdn.jsdelivr.net/gh/Innei/zshrc@0.1.1/webfont/OperatorMono.css"
            rel="stylesheet"
            type="text/css"
          />
          <link rel="shortcut icon" href="/favicon.svg" />
          <link rel="icon" href="/favicon.svg" />
          <link rel="apple-touch-icon" href="/favicon.svg" />
          <link rel="sitemap" href="/sitemap.xml" />
          {configs.alwaysHTTPS ? (
            <meta
              httpEquiv="Content-Security-Policy"
              content="upgrade-insecure-requests"
            />
          ) : null}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.version = '${process.env.VERSION || version}'`,
            }}
          />

          {/* FIXME: hack to load loader style first */}
          <style
            dangerouslySetInnerHTML={{
              __html: `.loader-logo{top:50%;left:50%;opacity:1;z-index:100;height:8em;color:#fff;position:fixed;transform:translate(-50%, -50%);transition:transform 0.8s cubic-bezier(0.5, 0, 0.5, 1.5);perspective:1500px}.loader-logo .animation{animation:zoom-in 1s ease-out backwards;position:relative;z-index:999;transform:translate3d(0, 0, 0);will-change:transform}.loader:before{top:50%;pointer-events:none;left:50%;z-index:99;content:'';width:100vmax;height:100vmax;position:fixed;border-radius:50%;background:var(--green);transform:translate(-50%, -50%) scale(1.5);animation:fade-out 1s ease-out}body.loading .loader:before{pointer-events:all;opacity:1;transition:opacity 0.2s;animation:none}body.loading .loader-logo{transform:translate(-50%, -50%) scale(1);transition:transform 0.8s cubic-bezier(0.5, 0, 0.5, 1.5)}body.loading .loader-logo .animation{animation:none}@keyframes zoom-in{50%{transform:translate3d(0, 0, -300px);opacity:1}80%{opacity:1}to{transform:translate3d(0, 0, 1500px);opacity:0}}@keyframes fade-out{30%{opacity:1}60%{opacity:1}100%{opacity:0}}`,
            }}
          ></style>
        </Head>

        <body id={'app'} className="loading">
          <Main />
          <NextScript />

          {GA_TRACKING_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_TRACKING_ID}', {page_path: window.location.pathname,});`,
                }}
              />
            </>
          )}

          <script
            src={`https://cdn.jsdelivr.net/npm/smooth-scroll@16.1.3/dist/smooth-scroll.min.js`}
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `new SmoothScroll('a[href*="#"]', {speed: 500,offset: 150,easing: 'easeInOutCubic',durationMax: 1000,durationMin: 350,topOnEmptyHash: true,emitEvents: true,updateURL: false,popstate: false})`,
            }}
          ></script>
        </body>
      </Html>
    )
  }
}
