import type { FC } from 'react'
import { memo, useRef } from 'react'

import { Avatar } from '~/components/universal/Avatar'
import { ImpressionView } from '~/components/universal/ImpressionView'
import { RelativeTime } from '~/components/universal/RelativeTime'
import { store } from '~/store'

const wrapperProps = { className: '!border-none !shadow-none' }
export const ToastCard: FC<{
  title: string
  description?: string
  text?: string
}> = memo((props) => {
  const { userStore } = store
  const { description, text, title } = props
  const date = useRef(new Date())
  return (
    <ImpressionView
      trackerMessage={`Toast 曝光 - ${title} · ${description} · ${text}`}
    >
      <div
        className="relative flex space-x-4 items-center p-4 w-full text-[12px] bg-bg-opacity overflow-hidden
    text-inherit border border-shallow border-opacity-50
    rounded-xl backdrop-filter backdrop-brightness-150 backdrop-brightness-110 backdrop-saturate-150 backdrop-blur-md
  select-none cursor-pointer mb-4 
    "
      >
        <div className="flex-shrink-0">
          <Avatar
            useRandomColor={false}
            imageUrl={userStore.master?.avatar || ''}
            size={40}
            wrapperProps={wrapperProps}
          />
        </div>
        <div className="flex-grow relative flex-shrink min-w-0 break-all leading-[1.5]">
          <p className="text-[1.05em] leading-none font-medium truncate">
            {title}
          </p>
          {text && (
            <p className="line-clamp-2">
              <span>{text}</span>
            </p>
          )}
          {description && (
            <p className="text-gray-2 line-clamp-2">{description}</p>
          )}
        </div>

        <div className="flex-shrink-0 text-[0.8em] self-start text-gray-2">
          <RelativeTime date={date.current} />
        </div>
      </div>
    </ImpressionView>
  )
})
