import { NextApiRequest, NextApiResponse } from 'next'
import httpProxyMiddleware from 'next-http-proxy-middleware'
import { isDev } from 'utils/utils'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const pathRewrite: {
    patternStr: string
    replaceStr: string
  }[] = []

  if (isDev) {
    pathRewrite.push({
      patternStr: '^/api',
      replaceStr: '',
    })
  }
  return httpProxyMiddleware(req, res, {
    // You can use the `http-proxy` option
    target: !isDev ? 'http://localhost:2333/api' : 'http://localhost:2333',
    // In addition, you can use the `pathRewrite` option provided by `next-http-proxy-middleware`
    pathRewrite,
    changeOrigin: true,
  })
}
