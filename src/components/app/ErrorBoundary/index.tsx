import React, { Component } from 'react'

export class ErrorBoundary extends Component<{
  children: React.ReactNode
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

  render() {
    const { errorInfo } = this.state
    const { children, ...restProps } = this.props

    if (errorInfo) {
      return <div>渲染报错</div>
    }

    // @ts-ignore
    return React.cloneElement(children, {
      ...restProps,
    })
  }
}
