import type { FC } from 'react'

import { FloatPopover } from '../FloatPopover'
import { IonSearch } from '../Icons/layout'

export const ImageTagPreview: FC<{ src: string; alt: string }> = (props) => {
  const { src, alt } = props
  return (
    <FloatPopover
      triggerComponent={() => (
        <a
          href={src}
          target="_blank"
          className="text-primary inline-flex items-center space-x-1"
        >
          <IonSearch />
          <span>查看图片</span>
        </a>
      )}
    >
      <img
        className="max-h-[50vh] max-w-[500px] phone:max-w-[90vw] "
        src={src}
        alt={alt}
      />
    </FloatPopover>
  )
}
