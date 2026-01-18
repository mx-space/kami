import process from 'node:process'

import lighthouse from 'lighthouse'
import { launch } from 'chrome-launcher'
import { chromium } from 'playwright'
import axios from 'axios'

const baseUrl = process.env.PERF_BASE_URL || 'http://localhost:2323/'
const apiBaseUrl =
  process.env.PERF_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:2323/api/v2'
const apiEndpoints = (process.env.PERF_API_ENDPOINTS || '/aggregate')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const main = async () => {
  const chromePath = chromium.executablePath()
  const chrome = await launch({
    chromePath,
    chromeFlags: ['--headless=new', '--no-sandbox'],
  })

  const result = await lighthouse(
    baseUrl,
    {
      port: chrome.port,
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance'],
    },
    {
      extends: 'lighthouse:default',
      settings: {
        preset: 'desktop',
        throttlingMethod: 'provided',
        maxWaitForLoad: 60_000,
      },
    },
  )

  try {
    await chrome.kill()
  } catch {}

  const lhr = result.lhr
  const perfScore = Math.round((lhr.categories.performance.score || 0) * 100)
  const fcp = lhr.audits['first-contentful-paint']?.numericValue || Infinity

  const apiTimings = []
  for (const endpoint of apiEndpoints) {
    const url = `${apiBaseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
    const start = Date.now()
    try {
      await axios.get(url, { timeout: 10_000 })
      apiTimings.push({ endpoint, ms: Date.now() - start })
    } catch {
      apiTimings.push({ endpoint, ms: Infinity })
    }
  }

  console.log(
    JSON.stringify({
      perfScore,
      fcpMs: Math.round(fcp),
      apiTimings,
    }),
  )

  if (perfScore < 90) {
    process.exitCode = 1
  }
  if (fcp > 1500) {
    process.exitCode = 1
  }

  if (apiTimings.some((t) => t.ms > 300)) {
    process.exitCode = 1
  }
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
