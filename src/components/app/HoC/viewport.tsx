import type { FC, ReactNode } from 'react'

import { useDetectPadOrMobile } from '~/hooks/ui/use-viewport'

export const withDesktopOnly =
  <P extends { children?: ReactNode }>(Component: FC<P>): FC<P> => {
    const Wrapped: FC<P> = ({ children, ...props }) => {
      const isDesktop = !useDetectPadOrMobile()
      if (!isDesktop) {
        return null
      }
      return <Component {...(props as P)}>{children}</Component>
    }

    Wrapped.displayName = `withDesktopOnly(${Component.displayName || Component.name || 'Component'})`
    return Wrapped
  }
