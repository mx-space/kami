import { AggregateRoot } from '@mx-space/api-client'
import { createContext } from 'react'
import { KamiConfig } from 'types/config'

export type InitialDataType = {
  aggregateData: AggregateRoot
  config: KamiConfig
}
export const InitialContext = createContext({} as InitialDataType)

export const InitialContextProvider = InitialContext.Provider
