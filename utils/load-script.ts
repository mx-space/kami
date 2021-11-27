const isLoadScriptSet = new Set()

export function loadScript(url: string) {
  return new Promise((resolve, reject) => {
    if (isLoadScriptSet.has(url)) {
      return
    }
    const script = document.createElement('script')
    script.src = url

    script.onload = function (e) {
      isLoadScriptSet.add(url)
      resolve(e)
    }

    script.onerror = function (e) {
      // this.onload = null here is necessary
      // because even IE9 works not like others
      this.onerror = this.onload = null
      reject(e)
    }

    document.head.appendChild(script)
  })
}
