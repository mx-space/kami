import { createProxyMiddleware } from 'http-proxy-middleware'

const proxy = createProxyMiddleware({
  target: 'http://localhost:2333/socket.io',
  ws: true,
  changeOrigin: true,
})

export default proxy
