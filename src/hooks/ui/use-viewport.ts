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
  const position = useAppStore(({ position }) =>
    !isClientSide()
      ? false
      : position > window.innerHeight || position > window.screen.height,
  )

  return position
}

export const useIsOverPostTitleHeight = () => {
  const position = useAppStore(({ position }) =>
    !isClientSide()
      ? false
      : position > 126 || position > window.screen.height / 3,
  )

  return position
}
