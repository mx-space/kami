import type { FC } from 'react'
import React, {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import type { ShortcutOptions } from 'react-shortcut-guide'
import { ShortcutProvider } from 'react-shortcut-guide'

import { ModalStackProvider } from '@mx-space/kami-design'
import {
  BiMoonStarsFill,
  PhSunBold,
} from '@mx-space/kami-design/components/Icons/layout'

import { useActionStore } from '~/atoms/action'
import { useAppStore } from '~/atoms/app'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useThemeBackground } from '~/hooks/use-kami'
import { useMediaToggle } from '~/hooks/use-media-toggle'
import { useDetectIsNarrowThanLaptop } from '~/hooks/use-viewport'
import { appendStyle } from '~/utils/load-script'
import { springScrollToElement } from '~/utils/spring'

const Header = React.lazy(() =>
  import('./Header').then((mo) => ({
    default: mo.Header,
  })),
)

const ColorModeNoticePanel = React.lazy(() =>
  import('../../universal/Notice').then((mo) => ({
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
  import('../../biz/LampSwitch').then((mo) => ({
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
      timer && clearTimeout(timer)
    }
  }, [isDark])
}

export const BasicLayout: FC = memo(({ children }) => {
  const { toggle, value: isDark } = useMediaToggle()

  useThemeBackground()
  const isNarrowThanLaptop = useDetectIsNarrowThanLaptop()
  const isMobile = useAppStore((state) => state.viewport.mobile)
  const colorMode = useAppStore((state) => state.colorMode)

  const [showNotice, setNotice] = useState(false)
  const [tip, setTip] = useState({
    text: '白天模式',
    icon: <PhSunBold />,
  })

  const handleChangeColorMode = useCallback(() => {
    toggle()

    // 去相反的值去比较，因为 toggle 之后因为 react 的 batch 不会立刻更新
    setTip({
      text: !isDark ? '夜间模式' : '白天模式',
      icon: !isDark ? <BiMoonStarsFill /> : <PhSunBold />,
    })

    setNotice(true)
  }, [isDark, toggle])
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

        $el && springScrollToElement($el, 1000, -window.innerHeight / 2 + 100)
      }, 1050)
    }
  }, [])
  const { event } = useAnalyze()
  return (
    <ModalStackProvider isMobileViewport={isMobile}>
      <div className="inset-0 fixed bg-fixed pointer-events-none transition-opacity duration-500 ease transform-gpu">
        <div className="bg absolute inset-0 transform-gpu" />
      </div>
      <Suspense fallback={null}>
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
      <Suspense fallback={null}>
        <Footer />
        <MusicMiniPlayerStoreControlled />

        {!isNarrowThanLaptop && <LampSwitch onClick={handleChangeColorMode} />}

        <ColorModeNoticePanel
          {...tip}
          onExited={() => setNotice(false)}
          in={showNotice}
          key="panel"
        />

        <SearchHotKey />
      </Suspense>
    </ModalStackProvider>
  )
})
