import type { FC } from 'react'
import { useTranslations } from 'next-intl'

import { Banner } from '~/components/ui/Banner'
import { enabledLocaleSet } from '~/i18n/config'
import { useRouter } from '~/i18n/navigation'
import { useLocaleFromContext } from '~/provider/locale-context'
import { getContentTranslation } from '~/utils/translation'

const normalizeLocale = (value: string | undefined) =>
  value?.trim().toLowerCase().replace(/_/g, '-').split('-')[0]

const getLanguageNameKey = (locale: string) => `language.${locale}`

const useTranslationLanguages = (content: unknown) => {
  const translation = getContentTranslation(content)
  const locale = useLocaleFromContext()
  const languages = Array.from(
    new Set(
      [translation.sourceLang, ...translation.availableTranslations]
        .map(normalizeLocale)
        .filter(
          (language): language is string =>
            !!language && enabledLocaleSet.has(language),
        ),
    ),
  )

  return { locale, languages, translation }
}

export const TranslationLanguageSelector: FC<{ content: unknown }> = ({
  content,
}) => {
  const t = useTranslations('translation')
  const router = useRouter()
  const { locale, languages, translation } = useTranslationLanguages(content)

  if (languages.length < 2) {
    return null
  }

  const selectedLocale = languages.includes(locale) ? locale : ''
  const sourceLang = normalizeLocale(translation.sourceLang)

  return (
    <label className="text-gray-1 inline-flex items-center gap-2 text-sm font-normal">
      <span className="sr-only">{t('selectLanguage')}</span>
      <select
        aria-label={t('selectLanguage')}
        className="bg-transparent cursor-pointer appearance-auto rounded border border-current/20 px-2 py-1"
        value={selectedLocale}
        onChange={(event) => {
          const nextLocale = event.currentTarget.value
          if (nextLocale !== locale) {
            void router.push(router.asPath, {
              locale: nextLocale,
              scroll: false,
            })
          }
        }}
      >
        {!selectedLocale && (
          <option value="" disabled>
            {t('originalContent', {
              language: sourceLang
                ? t(getLanguageNameKey(sourceLang))
                : locale,
            })}
          </option>
        )}
        {languages.map((language) => (
          <option key={language} value={language}>
            {t(getLanguageNameKey(language))}
          </option>
        ))}
      </select>
    </label>
  )
}

export const TranslationNotice: FC<{ content: unknown }> = ({ content }) => {
  const t = useTranslations('translation')
  const router = useRouter()
  const { locale, translation } = useTranslationLanguages(content)
  const sourceLang = normalizeLocale(translation.sourceLang)
  const targetLang = normalizeLocale(translation.targetLang)

  if (translation.isTranslated && sourceLang && targetLang) {
    return (
      <Banner
        type="info"
        placement="left"
        className="mt-4 mb-6"
        showIcon={false}
      >
        <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2">
          <strong>{t('aiTranslation')}</strong>
          <span>
            {t(getLanguageNameKey(sourceLang))} →{' '}
            {t(getLanguageNameKey(targetLang))}
          </span>
          {sourceLang !== locale && (
            <button
              type="button"
              className="ml-auto underline underline-offset-2"
              onClick={() =>
                void router.push(router.asPath, {
                  locale: sourceLang,
                  scroll: false,
                })
              }
            >
              {t('viewOriginal')}
            </button>
          )}
        </div>
      </Banner>
    )
  }

  if (sourceLang && sourceLang !== locale) {
    return (
      <Banner
        type="info"
        placement="left"
        className="mt-4 mb-6"
        showIcon={false}
      >
        <span>
          {t('originalContent', { language: t(getLanguageNameKey(sourceLang)) })}
        </span>
      </Banner>
    )
  }

  return null
}
