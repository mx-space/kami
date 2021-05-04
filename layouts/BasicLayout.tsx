import {
  faAndroid,
  faApple,
  faCentos,
  faChrome,
  faLinux,
  faRedhat,
  faUbuntu,
  faWindows,
} from '@fortawesome/free-brands-svg-icons'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Footer } from 'components/Footer'
import Header from 'components/Header'
import { MusicMiniPlayerStoreControlled } from 'components/Player'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { UAParser } from 'ua-parser-js'
import { UUID } from 'utils'
import { observer } from 'utils/mobx'
import { useStore } from '../common/store'
import { Switch } from '../components/LampSwitch'
import { NoticePanel } from '../components/Notice'

export const BasicLayout = observer(({ children }) => {
  const { appStore, actionStore } = useStore()
  const { autoToggleColorMode, colorMode } = appStore
  const [showNotice, setNotice] = useState(false)
  const [tip, setTip] = useState({
    text: '白天模式',
    icon: faSun,
  })
  const handleChangeColorMode = useCallback(() => {
    const $html = document.documentElement
    if (autoToggleColorMode) {
      const nowColorMode = colorMode
      appStore.colorMode = nowColorMode == 'dark' ? 'light' : 'dark'
      appStore.autoToggleColorMode = false
      $html.classList.remove(nowColorMode)
      $html.classList.add(appStore.colorMode)
      const isDark = appStore.colorMode == 'dark'
      setTip({
        text: (isDark ? '夜间模式' : '白天模式') + '(手动)',
        icon: isDark ? faMoon : faSun,
      })
    } else {
      appStore.autoToggleColorMode = true
      appStore.colorMode = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      $html.classList.remove('dark', 'light')
      const osName = new UAParser(navigator.userAgent).getOS().name
      let icon = faCheckCircle
      switch (osName) {
        case 'Android': {
          icon = faAndroid
          break
        }
        case 'Mac OS':
        case 'iOS': {
          icon = faApple
          break
        }
        case 'Windows': {
          icon = faWindows
          break
        }
        case 'Linux': {
          icon = faLinux
          break
        }
        case 'CentOS': {
          icon = faCentos
          break
        }
        case 'Chromium OS': {
          icon = faChrome
          break
        }
        case 'Ubuntu': {
          icon = faUbuntu
          break
        }
        case 'RedHat': {
          icon = faRedhat
          break
        }
        default: {
          break
        }
      }
      setTip({
        text: '跟随系统',
        icon,
      })
    }
    setNotice(!showNotice)
  }, [appStore, autoToggleColorMode, colorMode, showNotice])
  const actionUUID = useMemo(() => {
    return new UUID()
  }, [])
  useEffect(() => {
    actionStore.removeActionByUUID(actionUUID)
    if (appStore.viewport.mobile || appStore.viewport.pad) {
      const action = {
        id: actionUUID,
        icon:
          appStore.colorMode === 'dark' ? (
            <FontAwesomeIcon icon={faSun} />
          ) : (
            <FontAwesomeIcon icon={faMoon} />
          ),
        onClick: handleChangeColorMode,
      }
      actionStore.appendActions(action)

      return () => {
        actionStore.removeActionByUUID(actionUUID)
      }
    }
  }, [
    actionStore,
    actionUUID,
    appStore.colorMode,
    appStore.viewport.mobile,
    appStore.viewport.pad,
    handleChangeColorMode,
  ])
  return (
    <>
      <Header />
      {children}
      <Footer />
      <MusicMiniPlayerStoreControlled />
      {!(appStore.viewport.mobile || appStore.viewport.pad) && (
        <Switch onClick={handleChangeColorMode} />
      )}

      {showNotice && (
        <NoticePanel {...tip} setShow={setNotice} key={'notice'} />
      )}
    </>
  )
})
