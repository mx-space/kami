import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import https from 'node:https'
import { spawn } from 'node:child_process'

import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import { chromium } from 'playwright'

const projectRoot = path.resolve(process.cwd())

const argv = process.argv.slice(2)
const shouldUpdate = argv.includes('--update')

const baseUrl = process.env.VR_BASE_URL || 'http://localhost:2323'
const startServer = process.env.VR_START_SERVER === '1'

const routes = [
  '/',
  '/posts',
  '/notes',
  '/projects',
  '/friends',
  '/says',
  '/timeline',
  '/login',
  '/register',
]

const baselineDir = path.join(projectRoot, 'tests', 'visual', 'baseline')
const actualDir = path.join(projectRoot, 'tests', 'visual', 'actual')
const diffDir = path.join(projectRoot, 'tests', 'visual', 'diff')

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true })
}

const requestGet = (url) =>
  new Promise((resolve, reject) => {
    const u = new URL(url)
    const lib = u.protocol === 'https:' ? https : http
    const req = lib.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: `${u.pathname}${u.search}`,
        method: 'GET',
        timeout: 5000,
      },
      (res) => {
        resolve(res.statusCode || 0)
      },
    )
    req.on('error', reject)
    req.on('timeout', () => {
      req.destroy(new Error('timeout'))
    })
    req.end()
  })

const waitForServer = async () => {
  const deadline = Date.now() + 90_000
  while (Date.now() < deadline) {
    try {
      const status = await requestGet(baseUrl)
      if (status >= 200 && status < 500) return
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('server_not_ready')
}

const sanitizeRoute = (route) => {
  if (route === '/') return 'home'
  return route.replace(/\//g, '_').replace(/^_+/, '').replace(/_+$/, '')
}

const readPng = (filePath) => PNG.sync.read(fs.readFileSync(filePath))
const writePng = (filePath, png) =>
  fs.writeFileSync(filePath, PNG.sync.write(png))

const main = async () => {
  ensureDir(baselineDir)
  ensureDir(actualDir)
  ensureDir(diffDir)

  let serverProcess = null
  if (startServer) {
    serverProcess = spawn('pnpm', ['run', 'start:prod'], {
      cwd: projectRoot,
      shell: true,
      stdio: 'inherit',
      env: process.env,
    })
    await waitForServer()
  }

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    timezoneId: 'UTC',
  })

  await context.addInitScript(() => {
    const nativeMatchMedia = window.matchMedia.bind(window)
    window.matchMedia = (query) => {
      if (query === '(prefers-color-scheme: dark)') {
        return {
          matches: false,
          media: query,
          onchange: null,
          addListener() {},
          removeListener() {},
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent() {
            return false
          },
        }
      }
      if (query === '(prefers-color-scheme: light)') {
        return {
          matches: true,
          media: query,
          onchange: null,
          addListener() {},
          removeListener() {},
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent() {
            return false
          },
        }
      }
      return nativeMatchMedia(query)
    }

    Math.random = () => 0.123456789
    const fixedNow = 1_700_000_000_000
    const NativeDate = Date
    class FixedDate extends NativeDate {
      constructor(...args) {
        // @ts-ignore
        if (args.length === 0) super(fixedNow)
        // @ts-ignore
        else super(...args)
      }
      static now() {
        return fixedNow
      }
    }
    // @ts-ignore
    globalThis.Date = FixedDate

    const style = document.createElement('style')
    style.innerHTML =
      '*{animation:none !important;transition:none !important}*::before{animation:none !important;transition:none !important}*::after{animation:none !important;transition:none !important}'
    document.head.appendChild(style)

    const unstablePhrases = ['个小伙伴正在浏览', '今天是', '今年已过', '今天已过']

    const hideUnstable = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      const targets = []
      let node = walker.nextNode()
      while (node) {
        if (
          node.nodeValue &&
          unstablePhrases.some((phrase) => node.nodeValue.includes(phrase))
        ) {
          targets.push(node)
        }
        node = walker.nextNode()
      }
      targets.forEach((n) => {
        const el = n.parentElement
        if (el) {
          el.style.visibility = 'hidden'
        }
      })
    }

    const mo = new MutationObserver(() => hideUnstable())
    mo.observe(document.documentElement, { subtree: true, childList: true })
    hideUnstable()
  })

  let failed = 0

  for (const route of routes) {
    const page = await context.newPage()
    const name = sanitizeRoute(route)
    const url = `${baseUrl}${route}`

    try {
      await page.goto(url, { waitUntil: 'networkidle' })
      await page.waitForTimeout(300)
      await page.evaluate(async () => {
        // @ts-ignore
        if (document.fonts && document.fonts.ready) {
          // @ts-ignore
          await document.fonts.ready
        }
      })
      await page.waitForTimeout(100)

      const screenshot = await page.screenshot({ fullPage: true, type: 'png' })
      const actualPath = path.join(actualDir, `${name}.png`)
      fs.writeFileSync(actualPath, screenshot)

      const baselinePath = path.join(baselineDir, `${name}.png`)
      if (!fs.existsSync(baselinePath) || shouldUpdate) {
        fs.copyFileSync(actualPath, baselinePath)
        continue
      }

      const baseline = readPng(baselinePath)
      const actual = readPng(actualPath)
      if (baseline.width !== actual.width || baseline.height !== actual.height) {
        console.error(`[visual] size_mismatch route=${route}`)
        failed++
        continue
      }

      const diff = new PNG({ width: baseline.width, height: baseline.height })
      const diffPixels = pixelmatch(
        baseline.data,
        actual.data,
        diff.data,
        baseline.width,
        baseline.height,
        { threshold: 0.1 },
      )
      const totalPixels = baseline.width * baseline.height
      const ratio = diffPixels / totalPixels

      if (ratio > 0.001) {
        failed++
        const diffPath = path.join(diffDir, `${name}.png`)
        writePng(diffPath, diff)
        console.error(
          `[visual] diff route=${route} diffPixels=${diffPixels} ratio=${ratio.toFixed(6)}`,
        )
      }
    } finally {
      await page.close()
    }
  }

  await browser.close()

  if (serverProcess) {
    serverProcess.kill()
  }

  if (failed > 0) {
    process.exitCode = 1
  }
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
