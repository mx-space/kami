import { useEffect } from 'react'
import { create } from 'zustand'

const useHeaderMetaStore = create<{
  title: string
  meta: string
  show: boolean
  setState: (v: any) => void
}>((setState) => ({
  title: '',
  meta: '',
  show: false,

  setState,
}))
/**
 * 设置头部 信息 (标题) 分享等操作
 */
export const useSetHeaderMeta = (title: string, description: string) => {
  const store = useHeaderMetaStore()
  useEffect(() => {
    store.setState({
      title,
      meta: description,
      show: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, title])

  useEffect(() => {
    return () => {
      store.setState((v) => ({
        ...v,
        show: false,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
export const useGetHeaderMeta = () => {
  return useHeaderMetaStore()
}

const useShareDataStore = create<{
  title: string
  text?: string
  url: string
  setState: (v: any) => void
}>((setState) => ({
  title: '',
  text: '' as string | undefined,
  url: '',
  setState,
}))

export const useSetHeaderShare = (title: string, text?: string) => {
  const store = useShareDataStore()

  useEffect(() => {
    store.setState({
      text,
      title,
      url: location.href,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, text])

  useEffect(() => {
    return () => {
      store.setState((v) => ({
        ...v,
        show: false,
      }))
    }
  }, [])
}

export const useGetHeaderShare = () => {
  return useShareDataStore()
}
