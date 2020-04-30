import configs from 'configs'
import Document, { Head, Main, NextScript } from 'next/document'
import AppStore from 'store/app'

import { GA_TRACKING_ID } from '../utils/gtag'

export default class MyDocument extends Document<{ app: AppStore }> {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <html>
        <Head lang={'zh-cn'}>
          <meta charSet="UTF-8" />
          <link rel="shortcut icon" href="/favicon.svg" />
          <link rel="icon" href="/favicon.svg" />
          <link rel="apple-touch-icon" href="/favicon.svg" />
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
