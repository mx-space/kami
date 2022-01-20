import clsx from 'clsx'
import { MdiLightFlaskEmpty } from 'components/Icons'
import { ImageLazy } from 'components/universal/Image'
import { FC, memo } from 'react'

export const ProjectIcon: FC<{ avatar?: string; alt?: string }> = memo(
  (props) => {
    return (
      <div
        className={clsx(
          'project-icon flex-shrink-0 flex-grow flex items-center justify-center',
          props.avatar ? 'bg-light-bg' : 'bg-blue text-white',
        )}
      >
        {props.avatar ? (
          <ImageLazy src={props.avatar} alt={props.alt} />
        ) : (
          <MdiLightFlaskEmpty className={'h-[70%] w-[70%]'} />
        )}
      </div>
    )
  },
)
