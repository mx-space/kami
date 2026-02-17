import { startTransition, useEffect, useState } from 'react'
import type { ToastContainerProps } from 'react-toastify'
import { ToastContainer as _ToastContainer } from 'react-toastify'

const toastOptions = {
  autoClose: 3000,
  pauseOnHover: true,
  hideProgressBar: true,
  newestOnTop: true,
  closeOnClick: true,
  closeButton: false,
  toastClassName: () => '',
  bodyClassName: () => '',
} satisfies ToastContainerProps

/**
 * Mount ToastContainer only on the client after hydration to avoid
 * "Hydration failed because the initial UI does not match what was rendered on the server"
 * (react-toastify can render different DOM on server vs client).
 * startTransition defers the update so Suspense boundaries can finish hydrating.
 */
export const ToastContainer = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    startTransition(() => setMounted(true))
  }, [])
  if (!mounted) return null
  return <_ToastContainer {...toastOptions} />
}
