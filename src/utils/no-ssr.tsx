import type { FC } from 'react'
import { memo } from 'react'

import { useIsClient } from '~/hooks/use-is-client'

export function NoSSRWrapper<K>(FC: FC<K>): FC<K> {
  const FC$: FC<any> = (props) => {
    const isClient = useIsClient()
    return isClient ? <FC {...props} /> : (null as any)
  }
  // @ts-ignore
  return memo((props) => <FC$ {...props} />)
}
