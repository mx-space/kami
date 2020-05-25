import { faSun, faMoon, faCogs } from '@fortawesome/free-solid-svg-icons'
import { Footer } from 'components/Footer'
import Header from 'components/Header'
import { observer } from 'mobx-react'
import dynamic from 'next/dynamic'
import { useState, useCallback } from 'react'
import { NoticePanel } from '../components/Notice'
import { PullSelect } from '../components/PullSelect'
import { useStore } from '../store'

const APlayer = dynamic(() => import('components/Player'), {
  ssr: false,
})

export const BasicLayout = observer(({ children }) => {
  const { appStore } = useStore()
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
      setTip({
        text: '自动切换',
        icon: faCogs,
      })
    }
    setNotice(!showNotice)
  }, [appStore, autoToggleColorMode, colorMode, showNotice])
  return (
    <>
      <Header />
      {children}
      <Footer />
      <APlayer />
      {!(appStore.viewport.mobile || appStore.viewport.pad) && (
        <PullSelect onClick={handleChangeColorMode} />
      )}

      {showNotice && (
        <NoticePanel {...tip} setShow={setNotice} key={'notice'} />
      )}
    </>
  )
})
