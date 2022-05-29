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

          {/* FIXME: hack to load loader style first */}
          <style
            dangerouslySetInnerHTML={{
              __html: `.loader-logo{top:50%;left:50%;opacity:1;z-index:100;height:8em;color:#fff !important;position:fixed;transform:translate(-50%, -50%);transition:none !important;perspective:1500px}.loader-logo .animation{animation:zoom-in 1s ease-out backwards;position:relative;z-index:999;transform:translate3d(0, 0, 0);will-change:transform}.loader:before{top:50%;pointer-events:none;left:50%;z-index:99;content:'';width:100vmax;height:100vmax;position:fixed;border-radius:50%;background:var(--green);transform:translate(-50%, -50%) scale(1.5);animation:fade-out 1s ease-out}body.loading .loader:before{pointer-events:all;opacity:1;transition:opacity 0.2s;animation:none}body.loading .loader-logo{transform:translate(-50%, -50%) scale(1);transition:transform 0.8s cubic-bezier(0.5, 0, 0.5, 1.5)}body.loading .loader-logo .animation{animation:none}@keyframes zoom-in{50%{transform:translate3d(0, 0, -300px);opacity:1}80%{opacity:1}to{transform:translate3d(0, 0, 1500px);opacity:0}}@keyframes fade-out{30%{opacity:1}60%{opacity:1}100%{opacity:0}}`,
            }}
          ></style>
        </Head>

        <body id={'app'} className="loading">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
