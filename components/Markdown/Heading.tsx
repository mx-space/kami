import { appStore } from 'common/store'
import { createElement, DOMAttributes, FC, useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import { isServerSide } from 'utils'
import { observer } from 'utils/mobx'
import observable from 'utils/observable'

export const Heading: () => FC<{
  level: 1 | 2 | 3 | 4 | 5 | 6
  key?: number
}> = () => {
  let index = 0
  if (isServerSide()) {
    return (props) => createElement(`h${props.level}`, null, props.children)
  }
  return observer(function RenderHeading(props) {
    const currentIndex = useMemo(() => index++, [])

    const title = props.children?.[0].props.value
    const data_id_title = useMemo(() => currentIndex + '¡' + title, [title])
    // const [offset, setOffset] = useState<null | number>(null)
    // const ref = useRef<HTMLHeadElement>(null)
    // useEffect(() => {
    //   setTimeout(() => {
    //     requestAnimationFrame(() => {
    //       if (!ref.current) {
    //         return
    //       }
    //       const offset = getElementViewTop(ref.current)
    //       setOffset(offset)
    //     })
    //   }, 1000)
    // }, [ref.current])
    const [ref, inView] = useInView({ rootMargin: '-250px' })
    const { scrollDirection } = appStore
    useEffect(() => {
      if (inView && scrollDirection === 'down') {
        observable.emit('toc', currentIndex)
      } else if (!inView && scrollDirection === 'up') {
        observable.emit('toc', currentIndex - 1)
      }
    }, [inView, scrollDirection])

    return createElement<DOMAttributes<HTMLHeadingElement>, HTMLHeadingElement>(
      `h${props.level}`,
      {
        'data-id-title': data_id_title,
        id: title,
        ref,
        // ...(offset ? { 'data-offset': offset } : {}),
      } as any,
      props.children,
    )
  })
}
