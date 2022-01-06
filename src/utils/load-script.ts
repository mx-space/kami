const isLoadScriptSet = new Set()

export function loadScript(url: string) {
  return new Promise((resolve, reject) => {
    if (isLoadScriptSet.has(url)) {
      return resolve(null)
    }
    const script = document.createElement('script')
    script.src = url

    isLoadScriptSet.add(url)
    script.onload = function (e) {
      resolve(e)
    }

    script.onerror = function (e) {
      // this.onload = null here is necessary
      // because even IE9 works not like others
      this.onerror = this.onload = null
      reject(e)

      isLoadScriptSet.delete(url)
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
