import { atom, useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

const headerMetaAtom = atom({
  title: '',
  meta: '',
  show: false,
})
/**
 * 设置头部 信息 (标题) 分享等操作
 */
export const useSetHeaderMeta = (title: string, description: string) => {
  const setter = useSetAtom(headerMetaAtom)
  useEffect(() => {
    setter({
      title,
      meta: description,
      show: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, title])

  useEffect(() => {
    return () => {
      setter((v) => ({
        ...v,
        show: false,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
export const useGetHeaderMeta = () => {
  return useAtomValue(headerMetaAtom)
}

const shareDataAtom = atom({
  title: '',
  text: '' as string | undefined,
  url: '',
})

export const useSetHeaderShare = (title: string, text?: string) => {
  const setter = useSetAtom(shareDataAtom)

  useEffect(() => {
    setter({
      text,
      title,
      url: location.href,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, text])

  useEffect(() => {
    return () => {
      setter((v) => ({
        ...v,
        show: false,
      }))
    }
  }, [])
}

export const useGetHeaderShare = () => {
  return useAtomValue(shareDataAtom)
}
