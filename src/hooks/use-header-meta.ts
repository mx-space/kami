import { useEffect } from 'react'

import { useStore } from '~/store'

/**
 * 设置头部 信息 (标题) 分享等操作
 */
export const useHeaderMeta = (title: string, description: string) => {
  const { appStore } = useStore()

  useEffect(() => {
    appStore.headerNav = {
      title,
      meta: description,
      show: true,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, title])

  useEffect(() => {
    return () => {
      appStore.headerNav.show = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const useHeaderShare = (title: string, text: string) => {
  const { appStore } = useStore()

  useEffect(() => {
    appStore.shareData = {
      text,
      title,
      url: location.href,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, text])

  useEffect(() => {
    return () => {
      appStore.shareData = null
    }
  }, [])
}
