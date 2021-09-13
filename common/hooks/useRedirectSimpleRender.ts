import { useEffect } from 'react'

export const useRedirectSimpleRender = (id?: string) => {
  useEffect(() => {
    if (!id) {
      return
    }
    const handler = (ev: KeyboardEvent) => {
      if (
        document.activeElement &&
        (['input', 'textarea'].includes(
          document.activeElement.tagName.toLowerCase(),
        ) ||
          document.activeElement.getAttribute('contenteditable'))
      ) {
        return
      }

      if (ev.key == '.') {
        window.location.href =
          (process.env.NEXT_PUBLIC_APIURL || '/api') + `/markdown/render/${id}`
      }
    }
    window.addEventListener('keydown', handler)

    return () => {
      window.removeEventListener('keydown', handler)
    }
  }, [id])
}
