import type { AppStore } from '~/atoms/app'
import type { StoreType } from '~/atoms/store'
import { isClientSide } from '~/utils/env'

export const useDetectPadOrMobile = (appStore: StoreType<AppStore>) => {
  const { pad, mobile } = appStore.viewport

  return pad || mobile
}

export const useDetectIsNarrowThanLaptop = (appStore: StoreType<AppStore>) => {
  const { hpad } = appStore.viewport

  return useDetectPadOrMobile(appStore) || hpad
}

export const useIsOverFirstScreenHeight = (appStore: StoreType<AppStore>) => {
  if (!isClientSide()) return false
  const { position } = appStore
  return position > window.innerHeight || position > screen.height
}

export const useIsOverPostTitleHeight = (appStore: StoreType<AppStore>) => {
  if (!isClientSide()) return false
  const { position } = appStore
  return position > 126 || position > screen.height / 3
}
