import Router from 'next/router'
import React, { PureComponent, createElement } from 'react'

export class ErrorBoundary extends PureComponent<{
  children: React.ReactNode
  fallbackComponent?: React.ComponentType<any>
  [k: string]: any
}> {
  state: any = {
    error: null,
    errorInfo: null,
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, 'render error')
    console.error(errorInfo)

    this.setState({
      error,
      errorInfo,
    })
  }
  eventsRef: any = () => void 0
  componentDidMount(): void {
    this.eventsRef = () => {
      this.setState({
        error: null,
        errorInfo: null,
      })
    }
    Router.events.on('routeChangeStart', this.eventsRef)
  }

  componentWillUnmount(): void {
    Router.events.off('routeChangeStart', this.eventsRef)
  }

  render() {
    const { errorInfo } = this.state
    const { children, ...restProps } = this.props

    if (errorInfo) {
      return (
        // @ts-ignore
        this.props.fallbackComponent ? (
          createElement(this.props.fallbackComponent, {
            error: errorInfo.error,
            errorInfo,
          })
        ) : (
          <div>渲染报错</div>
        )
      )
    }

    // @ts-ignore
    return React.cloneElement(children, {
      ...restProps,
    })
  }
}
