import { AggregateRoot } from '@mx-space/api-client'
import { defaultConfigs } from 'configs.default'
import { cloneDeep, mergeWith } from 'lodash-es'
import { createContext, FC, memo, useEffect, useMemo } from 'react'
import { KamiConfig } from 'types/config'

export type InitialDataType = {
  aggregateData: AggregateRoot
  config: KamiConfig
}
export const InitialContext = createContext({} as InitialDataType)

export const InitialContextProvider: FC<{ value: InitialDataType }> = memo(
  (props) => {
    const mergeThemeConfig = useMemo(() => {
      return mergeWith(
        cloneDeep(defaultConfigs),
        props.value.config,
        (old, newer) => {
          // 数组不合并
          if (Array.isArray(old)) {
            return newer
          }
        },
      ) as KamiConfig
    }, [])
    useEffect(() => {
      window.data = { ...props.value, config: mergeThemeConfig }
    }, [])

    return (
      <InitialContext.Provider
        value={{ ...props.value, config: mergeThemeConfig }}
      >
        {props.children}
      </InitialContext.Provider>
    )
  },
)
