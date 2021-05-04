import {
  createElement,
  DOMAttributes,
  FC,
  Fragment,
  useEffect,
  useMemo,
} from 'react'
import { useInView } from 'react-intersection-observer'
import { isClientSide } from 'utils'
import observable from 'utils/observable'

export const Heading = () => {
  let index = 0

  const RenderHeading: FC<{
    level: 1 | 2 | 3 | 4 | 5 | 6
    key?: number
  }> = (props) => {
    const currentIndex = useMemo(() => index++, [])

    const title = props.children?.[0].props.value
    const data_id_title = useMemo(() => currentIndex + '¡' + title, [title])

    return (
      <Fragment>
        {createElement<DOMAttributes<HTMLHeadingElement>, HTMLHeadingElement>(
          `h${props.level}`,
          {
            'data-id-title': data_id_title,
            id: title,
          } as any,
          props.children,
        )}
        <Anchor currentIndex={currentIndex} />
      </Fragment>
    )
  }

  return isClientSide()
    ? RenderHeading
    : ({ level, children }) => createElement(`h${level}`, null, children)
}

const Anchor: FC<{ currentIndex: number }> = ({ currentIndex }) => {
  // const topGap = window.innerHeight - 150
  const [ref, inView] = useInView({ rootMargin: '-33% 0% -33% 0%' })

  useEffect(() => {
    // const { scrollDirection } = appStore
    // if (inView && scrollDirection === 'down') {
    //   observable.emit('toc', currentIndex)
    // } else if (!inView && scrollDirection === 'up') {
    //   console.log(currentIndex - 1)

    // }
    observable.emit('toc', currentIndex)
  }, [currentIndex, inView])

  return (
    <>
      <span ref={ref}></span>
    </>
  )
}
