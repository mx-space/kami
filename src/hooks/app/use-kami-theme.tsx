import { useEffect, useRef } from 'react'

import { useAppStore } from '~/atoms/app'
import type { ThemeColor } from '~/types/config'
import { shuffle } from '~/utils/_'
import { getRandomImage } from '~/utils/images'

import { useKamiConfig } from './use-initial-data'

const loadStyle = (css: string) => {
  const $style = document.createElement('style')
  $style.innerHTML = css

  document.head.appendChild($style)
  return () => {
    document.head.removeChild($style)
  }
}
export const useThemeBackground = () => {
  const {
    site: { background },
  } = useKamiConfig()
  const colorMode = useAppStore((state) => state.colorMode)
  useEffect(() => {
    return loadStyle(
      `body .bg-fixed > .bg { background: url(${
        background.src[colorMode] || background.src.light || background.src.dark
      }) ${background.position}; background-color: var(--light-bg);  };`,
    )
  }, [background.position, background.src, colorMode])
}

export const useBackgroundOpacity = (opacity: number) => {
  useEffect(() => {
    return loadStyle(`body .bg-fixed { opacity: ${opacity}; }`)
  }, [opacity])
}

export const useFooterBackground = (footerClassName: string) => {
  const {
    site: {
      footer: { background },
    },
  } = useKamiConfig()
  const colorMode = useAppStore((state) => state.colorMode)
  useEffect(() => {
    return loadStyle(
      `.${footerClassName}::before { background: url(${
        background.src[colorMode] || background.src.light || background.src.dark
      }) ${background.position};  }`,
    )
  }, [background.position, background.src, colorMode, footerClassName])
}

export const useRandomImage = (count: number | 'all' = 1) => {
  const nextCount = count === 'all' ? undefined : count
  const {
    site: { figure },
  } = useKamiConfig()

  return useRef(
    figure?.length
      ? shuffle(figure).slice(0, nextCount)
      : getRandomImage(nextCount),
  ).current
}

export const useCustomThemeColor = (
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
