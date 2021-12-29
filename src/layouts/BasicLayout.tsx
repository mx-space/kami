import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMediaToggle } from 'common/hooks/use-media-toggle'
import { useThemeBackground } from 'common/hooks/use-theme-background'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { UUID } from 'utils'
import { observer } from 'utils/mobx'
import { Footer } from 'views/Footer'
import { MusicMiniPlayerStoreControlled } from 'views/for-pages/Player'
import { Header } from 'views/Header'
import { useStore } from '../common/store'
import { Switch } from '../components/LampSwitch'
import { NoticePanel } from '../components/Notice'

export const BasicLayout = observer(({ children }) => {
  const { appStore, actionStore } = useStore()

  const { toggle, value: isDark } = useMediaToggle()

  useThemeBackground()

  const [showNotice, setNotice] = useState(false)
  const [tip, setTip] = useState({
    text: '白天模式',
    icon: faSun,
  })
  const handleChangeColorMode = useCallback(() => {
    toggle()

    setTip({
      text: isDark ? '夜间模式' : '白天模式',
      icon: isDark ? faMoon : faSun,
    })

    setNotice(!showNotice)
  }, [isDark, showNotice, toggle])
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
