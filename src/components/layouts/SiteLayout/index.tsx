import type { FC } from 'react'
import React, {
  memo,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { useTranslations } from 'next-intl'
import type { ShortcutOptions } from 'react-shortcut-guide'
import { ShortcutProvider } from 'react-shortcut-guide'

import { useActionStore } from '~/atoms/action'
import { useAppStore } from '~/atoms/app'
import { Suspense } from '~/components/app/Suspense'
import { BiMoonStarsFill, PhSunBold } from '~/components/ui/Icons/layout'
import { ModalStackProvider } from '~/components/ui/Modal'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { useThemeBackground } from '~/hooks/app/use-kami-theme'
import { useDarkModeDetector } from '~/hooks/ui/use-dark-mode-detector'
import { useDetectIsNarrowThanLaptop } from '~/hooks/ui/use-viewport'
import { appendStyle } from '~/utils/load-script'
import { springScrollToElement } from '~/utils/spring'

const Header = React.lazy(() =>
  import('./Header').then((mo) => ({
    default: mo.Header,
  })),
)

const ColorModeNoticePanel = React.lazy(() =>
  import('../../ui/Notice').then((mo) => ({
    default: mo.NoticePanel,
  })),
)

const SearchHotKey = React.lazy(() =>
  import('~/components/widgets/Search').then((mo) => ({
    default: mo.SearchHotKey,
  })),
)
const Footer = React.lazy(() =>
  import('./Footer').then((mo) => ({
    default: mo.Footer,
  })),
)
const LampSwitch = React.lazy(() =>
  import('../../widgets/LampSwitch').then((mo) => ({
    default: mo.LampSwitch,
  })),
)
const MusicMiniPlayerStoreControlled = React.lazy(() =>
  import('~/components/widgets/Player').then((mo) => ({
    default: mo.MusicMiniPlayerStoreControlled,
  })),
)

const useColorModeTransition = (isDark: boolean) => {
  useEffect(() => {
    const { remove } = appendStyle(`:root * { transition: none!important; }`)
    let timer = null as any
    timer = setTimeout(() => {
      remove()
    }, 100)

    return () => {
      remove()
      if (timer) clearTimeout(timer)
    }
  }, [isDark])
}

export const SiteLayout: FC = memo(({ children }) => {
  const { toggle, value: isDark } = useDarkModeDetector()

  useThemeBackground()
  const isNarrowThanLaptop = useDetectIsNarrowThanLaptop()
  const isMobile = useAppStore((state) => state.viewport.mobile)
  const colorMode = useAppStore((state) => state.colorMode)

  const t = useTranslations('common')
  const [showNotice, setNotice] = useState(false)
  const [tip, setTip] = useState({
    text: t('lightMode'),
    icon: <PhSunBold />,
  })

  const handleChangeColorMode = useCallback(() => {
    toggle()

    // 去相反的值去比较，因为 toggle 之后因为 react 的 batch 不会立刻更新
    setTip({
      text: !isDark ? t('darkMode') : t('lightMode'),
      icon: !isDark ? <BiMoonStarsFill /> : <PhSunBold />,
    })

    setNotice(true)
  }, [isDark, toggle, t])
  const actionId = useId()
  useEffect(() => {
    const actionStore = useActionStore.getState()
    actionStore.removeActionById(actionId)
    if (isNarrowThanLaptop) {
      const action = {
        id: actionId,
        icon: colorMode === 'dark' ? <PhSunBold /> : <BiMoonStarsFill />,
        onClick: handleChangeColorMode,
      }
      actionStore.appendActions(action)

      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        actionStore.removeActionById(actionId)
      }
    }
  }, [colorMode, isNarrowThanLaptop, handleChangeColorMode, actionId])

  useColorModeTransition(isDark!)

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace(/^#/, '')
      setTimeout(() => {
        const $el = document.getElementById(decodeURIComponent(id))

        if ($el) springScrollToElement($el, -window.innerHeight / 2 + 100)
      }, 1050)
    }
  }, [])
  const { event } = useAnalyze()
  return (
    <ModalStackProvider isMobileViewport={isMobile}>
      <div className="ease pointer-events-none fixed inset-0 transform-gpu bg-fixed transition-opacity duration-500">
        <div className="bg absolute inset-0 transform-gpu" />
      </div>

      <Suspense>
        <Header />
      </Suspense>

      <div className="app-content">{children}</div>

      <ShortcutProvider
        options={
          useRef<ShortcutOptions>({
            darkMode: 'class',
            darkClassName: 'html.dark',
            onGuidePanelOpen: () => {
              event({
                label: 'Guide 被打开了',
                action: TrackerAction.Interaction,
              })
            },
          }).current
        }
      />

      <Suspense>
        <Footer />
      </Suspense>

      <Suspense>
        <MusicMiniPlayerStoreControlled />
      </Suspense>

      <Suspense>
        {!isNarrowThanLaptop && <LampSwitch onClick={handleChangeColorMode} />}
      </Suspense>

      <Suspense>
        <ColorModeNoticePanel
          {...tip}
          onExited={() => setNotice(false)}
          in={showNotice}
          key="panel"
        />
      </Suspense>

      <Suspense>
        <SearchHotKey />
      </Suspense>
    </ModalStackProvider>
  )
})
