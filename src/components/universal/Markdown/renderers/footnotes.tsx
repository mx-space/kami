import type { FC } from 'react'

import { Divider } from '../../Divider'

export const MFootNote: FC = (props) => {
  return (
    <div className="mt-4 children:my-2 children:leading-6 children:text-base">
      <Divider />
      {props.children}
    </div>
  )
}
