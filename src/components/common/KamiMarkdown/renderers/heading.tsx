import type { DOMAttributes, FC } from 'react'
import React, {
  Fragment,
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
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

    const [id, setId] = useState('')

    useEffect(() => {
      if (!$titleRef.current) {
        return
      }

      setId($titleRef.current.textContent || '')

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { ref } = useInView({
      rootMargin: '-33% 0% -33% 0%',
      onChange(inView) {
        if (inView) {
          eventBus.emit(CustomEventTypes.TOC, currentIndex)
        }
      },
    })

    const $titleRef = useRef<HTMLHeadingElement>(null)

    return (
      <Fragment>
        {createElement<DOMAttributes<HTMLHeadingElement>, HTMLHeadingElement>(
          `h${props.level}`,
          {
            id,
            ref: $titleRef,
            'data-index': currentIndex,
          } as any,
          <Fragment>
            {props.children}
            <span ref={ref} />
          </Fragment>,
        )}
      </Fragment>
    )
  }

  return RenderHeading
}
