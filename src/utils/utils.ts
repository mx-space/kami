export const resolveUrl = (pathname: string | undefined, base: string) => {
  return base.replace(/\/$/, '').concat(pathname || '')
}

export const escapeHTMLTag = (html: string) => {
  const lt = /</g,
    gt = />/g,
    ap = /'/g,
    ic = /"/g
  return html
    .toString()
    .replace(lt, '&lt;')
    .replace(gt, '&gt;')
    .replace(ap, '&#39;')
    .replace(ic, '&#34;')
}

const _noop = /* @__PURE__ */ {}
export const noop = /* @__PURE__ */ new Proxy(_noop, {
  get() {
    return noop
  },
  apply() {
    // eslint-disable-next-line prefer-rest-params
    return Reflect.apply(noop, this, arguments)
  },
})
