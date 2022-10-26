import type { FC } from 'react'
import { use } from 'react'

import type { InitialDataType } from '~/context'
import { InitialContextProvider } from '~/context'
import { fetchInitialData } from '~/utils/app'

const fetchRootData = async () => {
  const data: InitialDataType & { reason?: any } = await fetchInitialData()

  return data
}
export const RootContainer: FC = (props) => {
  const initData = use(fetchRootData())

  // TODO, error handle
  return (
    // <RootStoreProvider>
    <InitialContextProvider value={initData}>
      {props.children}
    </InitialContextProvider>
    // </RootStoreProvider>
  )
}
