export const allLocales = ['zh', 'en', 'ja'] as const
export type Locale = (typeof allLocales)[number]
export const defaultLocale: Locale = 'zh'

const allLocaleSet = new Set<string>(allLocales)

function parseEnabledLocalesFromEnv(): readonly Locale[] {
  const raw = process.env.NEXT_PUBLIC_KAMI_LOCALES
  if (raw == null || raw.trim() === '') {
    return allLocales
  }
  const seen = new Set<string>()
  const ordered: Locale[] = []
  for (const part of raw.split(',')) {
    const code = part.trim()
    if (!code || seen.has(code)) continue
    if (!allLocaleSet.has(code)) continue
    seen.add(code)
    ordered.push(code as Locale)
  }
  if (ordered.length === 0) {
    return allLocales
  }
  if (!ordered.includes(defaultLocale)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[kami] NEXT_PUBLIC_KAMI_LOCALES must include default locale "zh". Falling back to all locales.',
      )
    }
    return allLocales
  }
  return ordered
}

/** Locales exposed in routing, middleware, and the language switcher (from env). */
export const enabledLocales: readonly Locale[] = parseEnabledLocalesFromEnv()

export const enabledLocaleSet = new Set<string>(enabledLocales)
export const allLocalesSet = new Set<string>(allLocales)
