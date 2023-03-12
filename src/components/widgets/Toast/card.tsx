import type { FC } from 'react'
import { memo, useRef } from 'react'
import { toast } from 'react-toastify'

import { Avatar } from '@mx-space/kami-design/components/Avatar'
import { CloseIcon } from '@mx-space/kami-design/components/Icons'

import { useUserStore } from '~/atoms/user'
import { ImpressionView } from '~/components/biz/ImpressionView'
import { RelativeTime } from '~/components/universal/RelativeTime'
import { useInitialData } from '~/hooks/use-initial-data'
import { useDetectPadOrMobile } from '~/hooks/use-viewport'

const wrapperProps = { className: '!border-none !shadow-none' }
export const ToastCard: FC<{
  title?: string
  description?: string
  text?: string
  avatar?: string
  onClick?: (e: MouseEvent) => void
  getToastId?: () => string
}> = memo((props) => {
  const isPadOrMobile = useDetectPadOrMobile()
  const { seo } = useInitialData()
  const { description, text, title = seo.title } = props
  const date = useRef(new Date())
  const avatar = useUserStore((state) => state.master?.avatar)
  return (
    <ImpressionView
      trackerMessage={`Toast 曝光 - ${title} · ${description} · ${text}`}
    >
      <div
        onClick={(e) => props.onClick?.(e.nativeEvent)}
        className="relative flex space-x-4 items-center p-4 w-full text-[12px] bg-bg-opacity overflow-hidden
    text-inherit border border-shallow border-opacity-50
    rounded-xl backdrop-filter backdrop-brightness-150 backdrop-brightness-110 backdrop-saturate-150 backdrop-blur-md
  select-none cursor-pointer mb-4 mr-4 box-border ml-auto"
        style={{
          width: isPadOrMobile ? 'calc(100% - 16px - 16px)' : '350px',
        }}
      >
        <div
          role={'button'}
          tabIndex={0}
          className="flex items-center justify-center absolute z-10 top-2 left-2 h-6 w-6 rounded-full overflow-hidden bg-gray-6 bg-opacity-80 dark:bg-dark-100 text-dark-50 dark:text-white"
          onClick={(e) => {
            e.stopPropagation()
            props.getToastId && toast.dismiss(props.getToastId())
          }}
        >
          <CloseIcon />
        </div>
        <div className="flex-shrink-0">
          <Avatar
            useRandomColor={false}
            imageUrl={props.avatar || avatar || ''}
            size={40}
            wrapperProps={wrapperProps}
          />
        </div>
        <div className="flex-grow relative flex-shrink min-w-0 break-all leading-[1.5] pr-10">
          <p className="text-[1.05em] leading-none font-medium truncate mb-1">
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

        <div className="absolute right-4 top-4 text-[0.8em] self-start text-gray-2">
          <RelativeTime date={date.current} />
        </div>
      </div>
    </ImpressionView>
  )
})
