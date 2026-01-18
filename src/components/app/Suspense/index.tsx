import type { FC } from 'react'
import { Suspense as ReactSuspense } from 'react'

export const Suspense: FC<{ children?: React.ReactNode }> = (props) => {
  return <ReactSuspense fallback={null}>{props.children}</ReactSuspense>
}
