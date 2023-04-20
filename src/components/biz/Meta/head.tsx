import Head from 'next/head'
import type { FC } from 'react'
import React, { memo, useInsertionEffect } from 'react'

import { API_URL } from '~/constants/env'
import { useInitialData, useKamiConfig } from '~/hooks/use-initial-data'
import type { ThemeColor } from '~/types/config'
import { isDev } from '~/utils/env'
import { loadScript } from '~/utils/load-script'

const useCustomThemeColor = (
  themeColorConfig: string | ThemeColor | undefined,
  cssVarKay = 'primary',
) => {
  if (!themeColorConfig) return [null, null] as const

  let nextThemeColorConfig = themeColorConfig
  if (typeof themeColorConfig === 'string') {
    nextThemeColorConfig = {
      dark: themeColorConfig,
      light: themeColorConfig,
      darkHover: themeColorConfig,
      lightHover: themeColorConfig,
    }
  } else {
    nextThemeColorConfig = {
      dark: themeColorConfig.dark || themeColorConfig.light,
      light: themeColorConfig.light || themeColorConfig.dark,
      darkHover: themeColorConfig.darkHover || themeColorConfig.dark,
      lightHover: themeColorConfig.lightHover || themeColorConfig.light,
    }
  }

  const { dark, light, darkHover, lightHover } = nextThemeColorConfig

  return [
    // eslint-disable-next-line react/jsx-key
    <style
      id="theme-style"
      dangerouslySetInnerHTML={{
        __html: `html {--${cssVarKay}: ${light}!important;--${cssVarKay}-hover: ${lightHover}!important};html.dark {--${cssVarKay}: ${dark}!important;--${cssVarKay}-hover: ${darkHover}!important};`,
      }}
    />,
    nextThemeColorConfig,
  ] as const
}
export const DynamicHeadMeta: FC = memo(() => {
  const initialData = useInitialData()
  const title = initialData.seo.title

  const themeConfig = useKamiConfig()
  const favicon = themeConfig.site.favicon || '/favicon.svg'

  const { dark: darkBg, light: lightBg } = themeConfig.site.background.src
  const { dark: darkFooter, light: lightFooter } =
    themeConfig.site.footer.background.src
  const { css, js, script, style } = themeConfig.site.custom
  const { themeColor, secondaryColor } = themeConfig.site
  const [themeColorMetaElement, themeColorConfig] =
    useCustomThemeColor(themeColor)
  const [secondaryColorElement] = useCustomThemeColor(
    secondaryColor,
    'secondary',
  )

  const { light: lightColor } = themeColorConfig || {}

  useInsertionEffect(() => {
    js && js.length && js.forEach((src) => loadScript(src))

    if (script) {
      eval(script)
    }
  }, [])

  return (
    <Head>
      <meta name="api_url" content={API_URL} />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="theme-color" content={lightColor || '#39C5BB'} />

      {!isDev ? (
        // force https
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      ) : null}

      {style ? <style dangerouslySetInnerHTML={{ __html: style }} /> : null}
      {css && css.length
        ? css.map((href, i) => <link rel="stylesheet" href={href} key={i} />)
        : null}
      {initialData.seo.keywords && (
        <meta name="keywords" content={initialData.seo.keywords.join(',')} />
      )}
      {/* for pwa */}
      <meta name="application-name" content={title} />
      <meta name="apple-mobile-web-app-title" content={title} />
      <meta name="msapplication-tooltip" content={title} />
      <meta
        name="msapplication-navbutton-color"
        content={lightColor || '#39C5BB'}
      />

      {/* for favicon */}
      <link rel="shortcut icon" href={favicon} />
      <link rel="icon" href={favicon} />
      <link rel="apple-touch-icon" href={favicon} />

      <link rel="preload" href={darkBg} as="image" />
      <link rel="preload" href={lightBg} as="image" />
      <link rel="preload" href={darkFooter} as="image" />
      <link rel="preload" href={lightFooter} as="image" />

      {themeColorMetaElement}
      {secondaryColorElement}
    </Head>
  )
})
