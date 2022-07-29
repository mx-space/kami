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
import Document, { Head, Html, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang={'zh-cn'}>
        <Head>
          <meta charSet="UTF-8" />
          <link rel="manifest" href="/manifest.json" />

          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          <meta name="msapplication-starturl" content="/" />
          <link rel="alternate" href="/feed" type="application/atom+xml" />
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

          <link rel="sitemap" href="/sitemap.xml" />
        </Head>

        <body id={'app'}>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
