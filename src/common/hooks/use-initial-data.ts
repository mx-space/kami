import { InitialContext } from 'common/context/initial-data'
import { defaultConfigs } from 'configs.default'
import { merge } from 'lodash-es'
import { useContext } from 'react'
import { KamiConfig } from 'types/config'

export const useInitialData = () => {
  return useContext(InitialContext).aggregateData
}

export const useThemeConfig = () => {
  return merge(defaultConfigs, useContext(InitialContext).config) as KamiConfig
}

export { useThemeConfig as useKamiConfig }
