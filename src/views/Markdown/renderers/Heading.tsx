import {
  createElement,
  DOMAttributes,
  FC,
  Fragment,
  memo,
  useMemo,
} from 'react'
import { isClientSide } from 'utils'

export const Heading = () => {
  let index = 0

  const RenderHeading: FC<{
    level: 1 | 2 | 3 | 4 | 5 | 6
    key?: number
  }> = memo((props) => {
    const currentIndex = useMemo(() => index++, [])
    const title = props.children?.[0].props.value

    return (
      <Fragment>
        {createElement<DOMAttributes<HTMLHeadingElement>, HTMLHeadingElement>(
          `h${props.level}`,
          {
            id: title,
            'data-index': currentIndex,
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
