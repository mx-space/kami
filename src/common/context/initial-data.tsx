import { AggregateRoot } from '@mx-space/api-client'
import { createContext, FC, memo, useEffect } from 'react'
import { KamiConfig } from 'types/config'

export type InitialDataType = {
  aggregateData: AggregateRoot
  config: KamiConfig
}
export const InitialContext = createContext({} as InitialDataType)

export const InitialContextProvider: FC<{ value: InitialDataType }> = memo(
  (props) => {
    useEffect(() => {
      window.data = props.value
    }, [props.value])
    return (
      <InitialContext.Provider value={props.value}>
        {props.children}
      </InitialContext.Provider>
    )
  },
)
