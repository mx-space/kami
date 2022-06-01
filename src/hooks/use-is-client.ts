import { useEffect, useState } from 'react'

import { isClientSide } from '~/utils'

export const useIsClient = () => {
  const [isClient, setIsClient] = useState(isClientSide())

  useEffect(() => {
    setIsClient(true)
  }, [])
  return isClient
}
