import Document, { Head, Main, NextScript } from 'next/document'
import AppStore from 'store/app'

export default class MyDocument extends Document<{ app: AppStore }> {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <html>
        <Head lang={'zh-cn'}>
          <link rel="shortcut icon" href="/favicon.svg" />
          <link rel="icon" href="/favicon.svg" />
          <link rel="apple-touch-icon" href="/favicon.svg" />
        </Head>
        <body id={'app'}>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
