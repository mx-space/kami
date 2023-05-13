import { useAppStore } from '~/atoms/app'

export const useIsDark = () =>
  useAppStore((state) => state.colorMode === 'dark')
