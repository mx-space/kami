export const hasActiveSession = (session: unknown) => {
  if (!session || typeof session !== 'object') {
    return false
  }

  const payload = session as Record<string, unknown>
  if (payload.session && typeof payload.session === 'object') {
    return true
  }
  if (payload.user && typeof payload.user === 'object') {
    return true
  }

  return Object.keys(payload).length > 0
}
