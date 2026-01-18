import process from 'node:process'
import 'dotenv/config'
import axios from 'axios'

const baseUrl = process.env.API_COMPARE_BASE_URL || process.env.NEXT_PUBLIC_API_URL
if (!baseUrl) {
  process.exitCode = 1
  throw new Error('missing_base_url')
}

const legacy = axios.create({
  baseURL: baseUrl,
  timeout: 10_000,
})

const modern = axios.create({
  baseURL: baseUrl,
  timeout: 10_000,
})

const targets = [
  { method: 'get', url: '/aggregate' },
  { method: 'get', url: '/aggregate/top' },
]

const normalize = (data) => {
  if (data === null || data === undefined) return data
  if (Array.isArray(data)) return data.map(normalize)
  if (typeof data === 'object') {
    const obj = {}
    for (const key of Object.keys(data).sort()) {
      obj[key] = normalize(data[key])
    }
    return obj
  }
  return data
}

const main = async () => {
  let failed = 0

  for (const t of targets) {
    const [a, b] = await Promise.allSettled([
      legacy.request({ method: t.method, url: t.url }),
      modern.request({ method: t.method, url: t.url }),
    ])

    const okA = a.status === 'fulfilled'
    const okB = b.status === 'fulfilled'
    if (!okA || !okB) {
      failed++
      continue
    }

    const da = normalize(a.value.data)
    const db = normalize(b.value.data)

    const sa = JSON.stringify(da)
    const sb = JSON.stringify(db)
    if (sa !== sb) {
      failed++
    }
  }

  if (failed > 0) process.exitCode = 1
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
