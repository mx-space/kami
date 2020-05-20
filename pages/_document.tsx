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
  canStopRenderByBrowser(ua: string) {
    const uaParser = new UAParser(ua)
    const browser = uaParser.getBrowser().name

    if (!browser) {
      return true
    }
    if (browser.toLowerCase() === 'ie') {
      return true
    }
    // todo version
    return false
  }
  render() {
    const ua = this.props.ua
    const canStopRender = this.canStopRenderByBrowser(ua)
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

        {!canStopRender ? (
          <body id={'app'}>
            <Main />
            <NextScript />
          </body>
        ) : (
          <body style={{ display: 'block !important' }}>
            <div>
              <p>哥哥换个 Chrome 嘛, 求你了</p>
            </div>
          </body>
        )}
      </html>
    )
  }
}
