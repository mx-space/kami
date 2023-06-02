import { Router } from 'next/router'
import type { FC } from 'react'
import React, { createElement, useEffect } from 'react'
import type { FallbackProps } from 'react-error-boundary'
import { ErrorBoundary as ErrorBoundary$ } from 'react-error-boundary'

import { captureException } from '@sentry/nextjs'

function FallbackRender({ error, resetErrorBoundary }) {
  useEffect(() => {
    console.log('capture', error)
    captureException(error)

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
