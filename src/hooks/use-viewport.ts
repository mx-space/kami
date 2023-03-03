import { useJotaiStore } from '~/atoms/store'
import { isClientSide } from '~/utils/env'

export const useDetectPadOrMobile = () => {
  const appStore = useJotaiStore('app')
  const { pad, mobile } = appStore.viewport
  console.log('1---', pad, mobile)

  return pad || mobile
}

export const useDetectIsNarrowThanLaptop = () => {
  const appStore = useJotaiStore('app')

  const { hpad } = appStore.viewport

  return useDetectPadOrMobile() || hpad
}

export const useIsOverFirstScreenHeight = () => {
  const appStore = useJotaiStore('app')
  if (!isClientSide()) return false
  const { position } = appStore
  return position > window.innerHeight || position > screen.height
}

export const useIsOverPostTitleHeight = () => {
  const appStore = useJotaiStore('app')
  if (!isClientSide()) return false
  const { position } = appStore
  return position > 126 || position > screen.height / 3
}
