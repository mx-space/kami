import { isDev } from './env'

const isLoadScriptMap: Record<string, 'loading' | 'loaded'> = {}
const loadingQueueMap: Record<string, [Function, Function][]> = {}
export function loadScript(url: string) {
  return new Promise((resolve, reject) => {
    const status = isLoadScriptMap[url]
    if (status === 'loaded') {
      return resolve(null)
    } else if (status === 'loading') {
      loadingQueueMap[url] = !loadingQueueMap[url]
        ? [[resolve, reject]]
        : [...loadingQueueMap[url], [resolve, reject]]
      return
    }

    const script = document.createElement('script')
    script.src = url
    script.crossOrigin = 'anonymous'

    isLoadScriptMap[url] = 'loading'
    script.onload = function () {
      isLoadScriptMap[url] = 'loaded'
      resolve(null)
      if (loadingQueueMap[url]) {
        loadingQueueMap[url].forEach(([resolve, reject]) => {
          resolve(null)
        })
        delete loadingQueueMap[url]
      }
    }

    if (isDev) {
      console.log('load script: ', url)
    }

    script.onerror = function (e) {
      // this.onload = null here is necessary
      // because even IE9 works not like others
      this.onerror = this.onload = null
      delete isLoadScriptMap[url]
      loadingQueueMap[url].forEach(([resolve, reject]) => {
        reject(e)
      })
      delete loadingQueueMap[url]
      reject(e)
    }

    document.head.appendChild(script)
  })
}

const cssSet = new Set()

export function loadStyleSheet(href: string) {
  if (cssSet.has(href)) {
    return
  }
  const $link = document.createElement('link')
  $link.href = href
  $link.rel = 'stylesheet'
  $link.type = 'text/css'
  $link.crossOrigin = 'anonymous'
  cssSet.add(href)

  $link.onerror = (e) => {
    $link.onerror = null
    cssSet.delete(href)
  }
  document.head.appendChild($link)

  return {
    remove: () => {
      $link.parentNode && $link.parentNode.removeChild($link)
      cssSet.delete(href)
    },
  }
}

export function appendStyle(style: string) {
  const $style = document.createElement('style')
  $style.innerHTML = style
  document.head.appendChild($style)
  return {
    remove: () => {
      $style.parentNode && $style.parentNode.removeChild($style)
    },
  }
}
