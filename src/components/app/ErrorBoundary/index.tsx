import { Router } from 'next/router'
import type { FC } from 'react'
import React, { createElement, useEffect } from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { ErrorBoundary as ErrorBoundary$ } from 'react-error-boundary'

import { reportError } from '~/utils/logger'

function FallbackRender({ error, resetErrorBoundary }) {
  useEffect(() => {
    reportError(error, { source: 'react-error-boundary' })

    const handler = () => {
      resetErrorBoundary()
    }
    Router.events.on('routeChangeStart', handler)
    return () => {
      Router.events.off('routeChangeStart', handler)
    }
  }, [error, resetErrorBoundary])
  return null
}

export const ErrorBoundary: FC<{
  FallbackComponent?: FC<FallbackProps>
  children?: React.ReactNode
}> = ({ FallbackComponent, children }) => {
  return (
    <ErrorBoundary$
      FallbackComponent={(props) => (
        <>
          {FallbackComponent && createElement(FallbackComponent, props)}
          <FallbackRender {...props} />
        </>
      )}
    >
      {children}
    </ErrorBoundary$>
  )
}
