import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { BiMoonStarsFill, PhSunBold } from '~/components/universal/Icons/layout'
import { useRootStore } from '~/context'
import { useMediaToggle } from '~/hooks/use-media-toggle'
import { useThemeBackground } from '~/hooks/use-theme-background'
import { springScrollToElement } from '~/utils/spring'

const ColorModeNoticePanel = React.lazy(() =>
  import('../../universal/Notice').then((mo) => ({
    default: mo.NoticePanel,
  })),
)
const Header = React.lazy(() =>
  import('./Header').then(({ Header }) => ({ default: Header })),
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
  import('../../universal/LampSwitch').then((mo) => ({
    default: mo.LampSwitch,
  })),
)
const MusicMiniPlayerStoreControlled = React.lazy(() =>
  import('~/components/widgets/Player').then((mo) => ({
    default: mo.MusicMiniPlayerStoreControlled,
  })),
)
export const BasicLayout: FC = observer(({ children }) => {
  const { appStore, actionStore } = useRootStore()

  const { toggle, value: isDark } = useMediaToggle()

  useThemeBackground()

  const [showNotice, setNotice] = useState(false)
  const [tip, setTip] = useState({
    text: '白天模式',
    icon: <PhSunBold />,
  })
  const handleChangeColorMode = useCallback(() => {
    toggle()

    // 去相反的值去比较, 因为 toggle 之后因为 react 的 batch 不会立刻更新
    setTip({
      text: !isDark ? '夜间模式' : '白天模式',
      icon: !isDark ? <BiMoonStarsFill /> : <PhSunBold />,
    })

    setNotice(!showNotice)
  }, [isDark, showNotice, toggle])
  const idSymbol = useRef(Symbol())
  useEffect(() => {
    actionStore.removeActionBySymbol(idSymbol.current)
    if (appStore.viewport.mobile || appStore.viewport.pad) {
      const action = {
        id: idSymbol.current,
        icon:
          appStore.colorMode === 'dark' ? <PhSunBold /> : <BiMoonStarsFill />,
        onClick: handleChangeColorMode,
      }
      actionStore.appendActions(action)

      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        actionStore.removeActionBySymbol(idSymbol.current)
      }
    }
  }, [
    actionStore,
    appStore.colorMode,
    appStore.viewport.mobile,
    appStore.viewport.pad,
    handleChangeColorMode,
  ])

  useLayoutEffect(() => {
    if (location.hash) {
      const id = location.hash.replace(/^#/, '')
      setTimeout(() => {
        const $el = document.getElementById(decodeURIComponent(id))

        $el && springScrollToElement($el, 1000, -window.innerHeight / 2 + 100)
      }, 50)
    }
  }, [])

  return (
    <>
      <div className="inset-0 fixed bg-fixed pointer-events-none transition-opacity duration-500 ease transform-gpu">
        <div className="bg absolute inset-0 transform-gpu" />
      </div>
      <Header />
      <div className="app-content">{children}</div>
      <Footer />
      <MusicMiniPlayerStoreControlled />
      {!(appStore.viewport.mobile || appStore.viewport.pad) && (
        <LampSwitch onClick={handleChangeColorMode} />
      )}

      <ColorModeNoticePanel
        {...tip}
        onExited={() => setNotice(false)}
        in={showNotice}
        key={'notice'}
      />

      <SearchHotKey />
    </>
  )
})
