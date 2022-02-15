import React, {
  createElement,
  DOMAttributes,
  FC,
  Fragment,
  memo,
  useEffect,
  useMemo,
} from 'react'
import { useInView } from 'react-intersection-observer'
import { CustomEventTypes } from 'types/events'
import { eventBus, isClientSide } from 'utils'

export const Heading = () => {
  let index = 0

  const RenderHeading: FC<{
    level: 1 | 2 | 3 | 4 | 5 | 6
    key?: number
  }> = memo((props) => {
    const currentIndex = useMemo(() => index++, [])
    const title = props.children?.[0].props.value

    const [ref, inView] = useInView({ rootMargin: '-33% 0% -33% 0%' })

    useEffect(() => {
      if (inView) {
        eventBus.emit(CustomEventTypes.TOC, currentIndex)
      }
    }, [inView])
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

  return isClientSide()
    ? RenderHeading
    : ({ level, children }) => createElement(`h${level}`, null, children)
}
