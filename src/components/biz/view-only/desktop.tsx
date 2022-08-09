import { observer } from 'mobx-react-lite'
import type { FC } from 'react'

import { useStore } from '~/store'

export const withDesktopOnly = <P extends {}>(Component: FC<P>): FC<P> =>
  observer(({ children, ...props }) => {
    const { appUIStore } = useStore()

    const isDesktop = !appUIStore.isPadOrMobile

    if (!isDesktop) {
      return null
    }
    // @ts-ignore
    return <Component {...props}>{children}</Component>
  })
