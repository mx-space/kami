import type { FC } from 'react'
import React from 'react'

import { useDetectPadOrMobile } from '~/hooks/ui/use-viewport'

export const withDesktopOnly =
  <P extends object>(Component: FC<P>): FC<P> => {
    const WithDesktopOnlyInner = ({ children, ...props }: P & { children?: React.ReactNode }) => {
      const isDesktop = !useDetectPadOrMobile()

      if (!isDesktop) {
        return null
      }
      // @ts-ignore
      return <Component {...(props as P)}>{children}</Component>
    }
    WithDesktopOnlyInner.displayName = 'WithDesktopOnly'
    return WithDesktopOnlyInner
  }
