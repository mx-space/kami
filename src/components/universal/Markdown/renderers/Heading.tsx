import type { DOMAttributes, FC } from 'react'
import React, { Fragment, createElement, memo, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import { eventBus } from 'utils'

import { CustomEventTypes } from '~/types/events'

export const Heading: () => React.ElementType<any> = () => {
  let index = 0

  const RenderHeading: FC<{
    level: 1 | 2 | 3 | 4 | 5 | 6
    key?: number
  }> = memo((props) => {
    const currentIndex = useMemo(() => index++, [])
    const title = props.children?.[0].props.value

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
  })

  // const isClient = useIsClient()
  return RenderHeading
}
