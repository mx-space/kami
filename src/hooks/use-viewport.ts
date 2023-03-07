import { useAppStore } from '~/atoms/app'
import { isClientSide } from '~/utils/env'

export const useDetectPadOrMobile = () => {
  const viewport = useAppStore((state) => state.viewport)
  const { pad, mobile } = viewport

  return pad || mobile
}

export const useDetectIsNarrowThanLaptop = () => {
  const { hpad } = useAppStore((state) => state.viewport)

  return useDetectPadOrMobile() || hpad
}

export const useIsOverFirstScreenHeight = () => {
  const position = useAppStore((state) => state.position)
  if (!isClientSide()) return false
  return position > window.innerHeight || position > screen.height
}

export const useIsOverPostTitleHeight = () => {
  const position = useAppStore((state) => state.position)
  if (!isClientSide()) return false

  return position > 126 || position > screen.height / 3
}
