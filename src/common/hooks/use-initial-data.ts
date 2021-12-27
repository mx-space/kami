import { InitialContext } from 'common/context/initial-data'
import { useContext } from 'react'

export const useInitialData = () => {
  return useContext(InitialContext).aggregateData
}

export const useThemeConfig = () => {
  return useContext(InitialContext).config
}

export { useThemeConfig as useKamiConfig }
