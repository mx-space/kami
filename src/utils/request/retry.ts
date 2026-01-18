export type RetryConfig = {
  maxRetries: number
  baseDelayMs: number
  maxDelayMs: number
}

export const defaultRetryConfig: RetryConfig = {
  maxRetries: 2,
  baseDelayMs: 200,
  maxDelayMs: 2000,
}

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

export const calcBackoffDelay = (
  attempt: number,
  { baseDelayMs, maxDelayMs }: RetryConfig,
) => {
  const exp = Math.min(maxDelayMs, baseDelayMs * 2 ** Math.max(0, attempt))
  const jitter = Math.floor(Math.random() * 100)
  return Math.min(maxDelayMs, exp + jitter)
}

