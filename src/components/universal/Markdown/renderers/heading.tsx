import type { DOMAttributes, FC } from 'react'
import React, { Fragment, createElement, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'

import { CustomEventTypes } from '~/types/events'
import { eventBus } from '~/utils/event-emitter'

interface HeadingProps {
  id: string
  className?: string
  children: React.ReactNode
  level: number
}
export const MHeading: () => FC<HeadingProps> = () => {
  let index = 0

  const RenderHeading = (props: HeadingProps) => {
    const currentIndex = useMemo(() => index++, [])
    // TODO  nested children heading

    const title: string = (function findTitle(child) {
      if (!child) {
        return ''
      }
      const children = child.props?.children
      return typeof children === 'string' ? children : findTitle(children)
      // @ts-ignore
    })(props.children[0])

    const { ref } = useInView({
      rootMargin: '-33% 0% -33% 0%',
      onChange(inView) {
        if (inView) {
          eventBus.emit(CustomEventTypes.TOC, currentIndex)
        }
      },
    })

    return (
      <Fragment>
        {createElement<DOMAttributes<HTMLHeadingElement>, HTMLHeadingElement>(
          `h${props.level}`,
          {
            id: title,
            'data-index': currentIndex,
            ref,
          } as any,
          props.children,
        )}
      </Fragment>
    )
  }

  return RenderHeading
}
