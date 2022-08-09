import type { FC } from 'react'
import React, { useEffect, useRef } from 'react'

export const MDetails: FC = (props) => {
  const outerRef = useRef(null)

  const children = <details>{props.children}</details>

  const [calculatedHeight, setCalculatedHeight] = React.useState(0)

  useEffect(() => {
    if (!outerRef.current) {
      return
    }
    const observer = new ResizeObserver(() => {
      setCalculatedHeight($wrapper.scrollHeight)
    })

    const $wrapper = outerRef.current as HTMLElement
    observer.observe($wrapper)

    return () => {
      observer.disconnect()
    }
  }, [])

  const cloned = useRef(
    React.cloneElement(children, { ref: outerRef, open: true }),
  ).current

  return (
    <div className="w-full relative">
      {React.Children.map(props.children, (child) => {
        return React.cloneElement(child as any, {})
      })}
      <div className="opacity-0 absolute pointer-events-none invisible">
        {cloned}
      </div>
    </div>
  )
}
