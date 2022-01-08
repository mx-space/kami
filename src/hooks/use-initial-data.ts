import { defaultConfigs } from 'configs.default'
import { InitialContext } from 'context/initial-data'
import { cloneDeep, mergeWith } from 'lodash-es'
import { useContext } from 'react'
import { KamiConfig } from 'types/config'

export const useInitialData = () => {
  return useContext(InitialContext).aggregateData
}

export const useThemeConfig = () => {
  const config = useContext(InitialContext).config

  return mergeWith(cloneDeep(defaultConfigs), config, (old, newer) => {
    // 数组不合并
    if (Array.isArray(old)) {
      return newer
    }
  }) as KamiConfig
}

export { useThemeConfig as useKamiConfig }
