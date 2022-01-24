import clsx from 'clsx'
import { ImageLazy } from 'components/universal/Image'
import { FC, memo } from 'react'

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
          <ImageLazy src={props.avatar} alt={props.name} />
        ) : (
          props.name?.charAt(0).toUpperCase()
        )}
      </div>
    )
  },
)
