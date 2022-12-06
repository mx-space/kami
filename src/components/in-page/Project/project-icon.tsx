import { clsx } from 'clsx'
import type { FC } from 'react'
import { memo } from 'react'

import { ImageLazy } from '@mx-space/kami-design/components/Image'

import { FlexText } from '~/components/universal/FlexText'

export const ProjectIcon: FC<{ avatar?: string; name?: string }> = memo(
  (props) => {
    return (
      <div
        className={clsx(
          'project-icon flex-shrink-0 flex-grow flex items-center justify-center bg-light-bg',
          props.avatar ? '' : 'bg-gray text-white',
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
