import { useAppStore } from '~/atoms/app'
import { isClientSide } from '~/utils/env'

export const useDetectPadOrMobile = () => {
  return useAppStore((state) => {
    const { pad, mobile } = state.viewport
    return pad || mobile
  })
}

export const useDetectIsNarrowThanLaptop = () => {
  const hpad = useAppStore((state) => state.viewport.hpad)

  return useDetectPadOrMobile() || hpad
}

export const useIsOverFirstScreenHeight = () => {
  const position = useAppStore(
    ({ position }) => position > window.innerHeight || position > screen.height,
  )
  if (!isClientSide()) return false
  return position
}

export const useIsOverPostTitleHeight = () => {
  const position = useAppStore(
    ({ position }) => position > 126 || position > screen.height / 3,
  )
  if (!isClientSide()) return false

  return position
}
