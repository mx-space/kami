import { Footer } from 'components/layouts/BasicLayout/Footer'
import { Header } from 'components/layouts/BasicLayout/Header'
import { BiMoonStarsFill, PhSunBold } from 'components/universal/Icons'
import { MusicMiniPlayerStoreControlled } from 'components/widgets/Player'
import { SearchHotKey } from 'components/widgets/Search'
import { useMediaToggle } from 'hooks/use-media-toggle'
import { useThemeBackground } from 'hooks/use-theme-background'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { useStore } from '../../../store'
import { Switch } from '../../universal/LampSwitch'
import { NoticePanel as ColorModeNoticePanel } from '../../universal/Notice'

export const BasicLayout: FC = observer(({ children }) => {
  const { appStore, actionStore } = useStore()

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

        if ($el) {
          $el.scrollIntoView({
            block: 'center',
          })
        }
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
        <Switch onClick={handleChangeColorMode} />
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
