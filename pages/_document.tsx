import configs from 'configs'
import Document, {
  DocumentContext,
  Head,
  Main,
  NextScript,
} from 'next/document'
import { GA_TRACKING_ID } from '../utils/gtag'
import { UAParser } from 'ua-parser-js'

export default class MyDocument extends Document<{ ua: string }> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    const ua = ctx.req?.headers['user-agent']
    return { ...initialProps, ua }
  }

  render() {
    const ua = this.props.ua

    return (
      <html>
        <Head lang={'zh-cn'}>
          <meta charSet="UTF-8" />
          <link rel="shortcut icon" href="/custom-icon.svg" />
          <link rel="icon" href="/custom-icon.svg" />
          <link rel="apple-touch-icon" href="/custom-icon.svg" />
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
