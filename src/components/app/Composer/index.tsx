import type { FC, PropsWithChildren, ReactNode } from 'react'
import { cloneElement } from 'react'

// @copy https://github.dev/toeverything/AFFiNE/blob/fd510834ed45a4e8bed9ded95cbe5ee284334236/apps/web/src/components/provider-composer.tsx#L1
export const ProviderComposer: FC<
  PropsWithChildren<{
    contexts: any
  }>
> = ({ contexts, children }) =>
  contexts.reduceRight(
    (kids: ReactNode, parent: any) =>
      cloneElement(parent, {
        children: kids,
      }),
    children,
  )
