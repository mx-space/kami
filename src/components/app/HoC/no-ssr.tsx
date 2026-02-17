import type { FC } from 'react'
import React, { memo } from 'react'

import { useIsClient } from '~/hooks/common/use-is-client'

export function withNoSSR<K>(FC: FC<K>): FC<K> {
  const FC$: FC<any> = (props) => {
    const isClient = useIsClient()
    return isClient ? <FC {...props} /> : (null as any)
  }
  const Wrapped = memo((props) => <FC$ {...props} />)
  Wrapped.displayName = 'WithNoSSR'
  // @ts-ignore
  return Wrapped
}
