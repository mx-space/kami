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
 * @LastEditTime: 2020-05-22 14:09:56
 * @LastEditors: Innei
 * @FilePath: /mx-web/pages/_document.tsx
 * @MIT
 */

import configs from 'configs'
import Document, {
  DocumentContext,
  Head,
  Main,
  NextScript,
} from 'next/document'
import { GA_TRACKING_ID } from '../utils/gtag'

export default class MyDocument extends Document<{ ua: string }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    const ua = ctx.req?.headers['user-agent']
    return { ...initialProps, ua }
  }

  render() {
    return (
      <html>
        <Head lang={'zh-cn'}>
          <meta charSet="UTF-8" />
          <link rel="manifest" href="manifest.json" />

          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="application-name" content="静かな森" />
          <meta name="apple-mobile-web-app-title" content="静かな森" />
          <meta name="msapplication-tooltip" content="静かな森" />
          <meta name="theme-color" content="#27ae60" />
          <meta name="msapplication-navbutton-color" content="#27ae60" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
          <meta name="msapplication-starturl" content="/" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="apple-icon-180.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="apple-icon-167.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="apple-icon-152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="apple-icon-120.png"
          />
          <link
            data-n-head="ssr"
            rel="apple-touch-startup-image"
            href="apple-icon-180.png"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          <link rel="shortcut icon" href="/custom-icon.svg" />
          <link rel="icon" href="/custom-icon.svg" />
          <link rel="apple-touch-icon" href="/custom-icon.svg" />
          <link rel="sitemap" href="/sitemap.xml" />
          {configs.alwaysHTTPS ? (
            <meta
              http-equiv="Content-Security-Policy"
              content="upgrade-insecure-requests"
            />
          ) : null}
          <meta name="keywords" content={configs.keywords.join(',')} />
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
        </Head>

        <body id={'app'}>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
