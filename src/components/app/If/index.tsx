import type { FC } from 'react'
import React from 'react'

export function IF<K>(FC: FC<K>, condition: () => boolean): FC<K> {
  const FC$: FC<any> = (props) => {
    const truthy = condition()

    return truthy ? <FC {...props} /> : (null as any)
  }

  const IFWrapper = (props: any) => <FC$ {...props} />
  IFWrapper.displayName = 'IF'
  return IFWrapper
}
