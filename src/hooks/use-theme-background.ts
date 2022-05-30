import { useEffect } from 'react'

import { useStore } from '~/store'

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
    appStore: { colorMode },
  } = useStore()
  const {
    site: { background },
  } = useKamiConfig()
  useEffect(() => {
    const remove = loadStyle(
      `body .bg-fixed > .bg { background: url(${
        background.src[colorMode] || background.src.light || background.src.dark
      }) ${background.position}; background-color: var(--light-bg);  };`,
    )

    return remove
  }, [background.position, background.src, colorMode])
}

export const useBackgroundOpacity = (opacity: number) => {
  useEffect(() => {
    const remove = loadStyle(`body .bg-fixed { opacity: ${opacity}; }`)
    return remove
  }, [opacity])
}

export const useFooterBackground = (footerClassName: string) => {
  const {
    appStore: { colorMode },
  } = useStore()
  const {
    site: {
      footer: { background },
    },
  } = useKamiConfig()
  useEffect(() => {
    const remove = loadStyle(
      `.${footerClassName}::before { background: url(${
        background.src[colorMode] || background.src.light || background.src.dark
      }) ${background.position};  }`,
    )

    return remove
  })
}
