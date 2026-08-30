type UnknownRecord = Record<string, unknown>

export type ContentTranslation = {
  isTranslated: boolean
  sourceLang?: string
  targetLang?: string
  availableTranslations: string[]
}

const asRecord = (value: unknown): UnknownRecord | undefined =>
  value && typeof value === 'object' ? (value as UnknownRecord) : undefined

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value : undefined

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && !!item)
    : []

/**
 * Normalizes both the typed Core fields and older response metadata shapes.
 * A missing field remains unknown: callers must never infer an original
 * language from the requested locale.
 */
export function getContentTranslation(content: unknown): ContentTranslation {
  const record = asRecord(content) ?? {}
  const responseMeta = asRecord(record.$meta)
  const raw = asRecord(record.$raw)
  const rawMeta = asRecord(raw?.$meta)
  const translationMeta =
    asRecord(record.translationMeta) ??
    asRecord(responseMeta?.translationMeta) ??
    asRecord(responseMeta?.translation) ??
    asRecord(rawMeta?.translationMeta) ??
    asRecord(rawMeta?.translation)

  const isTranslated =
    record.isTranslated === true ||
    responseMeta?.isTranslated === true ||
    rawMeta?.isTranslated === true
  const sourceLang =
    asString(record.sourceLang) ??
    asString(responseMeta?.sourceLang) ??
    asString(translationMeta?.sourceLang)
  const targetLang =
    asString(record.targetLang) ??
    asString(responseMeta?.targetLang) ??
    asString(translationMeta?.targetLang)
  const availableTranslations = Array.from(
    new Set([
      ...asStringArray(record.availableTranslations),
      ...asStringArray(responseMeta?.availableTranslations),
      ...asStringArray(rawMeta?.availableTranslations),
    ]),
  )

  return { isTranslated, sourceLang, targetLang, availableTranslations }
}

export type LocalizedContent = {
  /** Private client cache marker; this is not a Core model field. */
  __contentLocale?: string
}

export const getContentLocale = (content: unknown) =>
  asString(asRecord(content)?.__contentLocale)

export const withContentLocale = <T extends object>(content: T, locale: string) =>
  ({ ...content, __contentLocale: locale }) as T & LocalizedContent
