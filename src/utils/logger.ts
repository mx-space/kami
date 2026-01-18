import { captureException } from '@sentry/nextjs'

import { isDev } from '~/utils/env'

type LogLevel = 'info' | 'warn' | 'error'

let globalHandlersInited = false

const safeStringify = (value: unknown) => {
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export const log = (level: LogLevel, ...args: unknown[]) => {
  if (!isDev) return
  const fn =
    level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
  fn(...args)
}

export const reportError = (error: unknown, extra?: Record<string, unknown>) => {
  const err =
    error instanceof Error ? error : new Error(typeof error === 'string' ? error : safeStringify(error))
  captureException(err, extra ? { extra } : undefined)
}

export const initGlobalErrorHandlers = () => {
  if (typeof window === 'undefined') return () => {}
  if (globalHandlersInited) return () => {}
  globalHandlersInited = true

  const onError = (event: ErrorEvent) => {
    reportError(event.error ?? event.message, {
      source: 'window.error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    })
  }

  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    reportError(event.reason, { source: 'window.unhandledrejection' })
  }

  window.addEventListener('error', onError)
  window.addEventListener('unhandledrejection', onUnhandledRejection)

  return () => {
    window.removeEventListener('error', onError)
    window.removeEventListener('unhandledrejection', onUnhandledRejection)
  }
}

