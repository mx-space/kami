import { InitialContext } from 'common/context/initial-data'
import { defaultConfigs } from 'configs.default'
import { merge } from 'lodash-es'
import { useContext } from 'react'

export const useInitialData = () => {
  return useContext(InitialContext).aggregateData
}

export const useThemeConfig = () => {
  return merge(defaultConfigs, useContext(InitialContext).config)
}

export { useThemeConfig as useKamiConfig }
