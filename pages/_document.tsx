import Document, { Head, Main, NextScript } from 'next/document'
import AppStore from 'store/app'
import configs from 'configs'

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
          <meta
            http-equiv="Content-Security-Policy"
            content="upgrade-insecure-requests"
          />
          <meta name="keywords" content={configs.keywords.join(',')} />
        </Head>

        <body id={'app'}>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
