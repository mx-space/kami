import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

export const ClientOnly: FC<{
  children: React.ReactNode
  serverEl?: FC
}> = ({ children, serverEl }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>{isClient ? children : serverEl ? React.createElement(serverEl) : null}</>
  )
}
