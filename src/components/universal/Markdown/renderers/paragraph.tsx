import type { FC } from 'react'

export const MParagraph: FC<{}> = (props) => {
  return <p className={'paragraph'}>{props.children}</p>
}
