import { clsx } from 'clsx'
import type { FC } from 'react'
import { memo } from 'react'

import { FlexText } from '~/components/ui/FlexText'
import { ImageLazy } from '~/components/ui/Image'

export const ProjectIcon: FC<{ avatar?: string; name?: string }> = memo(
  (props) => {
    return (
      <div
        className={clsx(
          'project-icon bg-light-bg flex flex-shrink-0 flex-grow items-center justify-center',
          props.avatar ? '' : 'bg-gray-4 text-white',
        )}
      >
        {props.avatar ? (
          <ImageLazy src={props.avatar} />
        ) : (
          <FlexText
            text={props.name?.charAt(0).toUpperCase() || ''}
            size={0.5}
          />
        )}
      </div>
    )
  },
)
