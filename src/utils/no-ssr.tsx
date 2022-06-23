import type { FC } from 'react'
import { memo } from 'react'

import { useIsClient } from '~/hooks/use-is-client'

export function NoSSRWrapper<K>(FC: FC<K>): FC<K> {
  const FC$: FC<any> = memo((props) => {
    const isClient = useIsClient()
    return isClient ? <FC {...props} /> : (null as any)
  })
  // @ts-ignore
  return (props) => <FC$ {...props} />
}
