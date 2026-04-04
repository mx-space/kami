import { defineRouting } from 'next-intl/routing'

import { defaultLocale, enabledLocales } from './config'

export const routing = defineRouting({
  locales: [...enabledLocales],
  defaultLocale,
  localePrefix: 'as-needed',
})
