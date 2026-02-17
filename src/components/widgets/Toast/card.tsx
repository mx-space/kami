import { clsx } from 'clsx'
import type { FC } from 'react'
import { memo, useRef } from 'react'
import { toast } from 'react-toastify'

import { useUserStore } from '~/atoms/user'
import { ImpressionView } from '~/components/common/ImpressionView'
import { RelativeTime } from '~/components/common/RelativeTime'
import { Avatar } from '~/components/ui/Avatar'
import { CloseIcon } from '~/components/ui/Icons/layout'
import { useInitialData } from '~/hooks/app/use-initial-data'
import { useDetectPadOrMobile } from '~/hooks/ui/use-viewport'

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
        className="bg-bg-opacity border-shallow group relative mb-4 ml-auto mr-4 box-border flex w-full
    cursor-pointer select-none items-center space-x-4
    overflow-hidden rounded-xl border border-opacity-50 p-4 text-[12px]
  text-inherit backdrop-blur-md backdrop-brightness-110 backdrop-brightness-150 backdrop-saturate-150 backdrop-filter"
        style={{
          width: isPadOrMobile ? 'calc(100% - 16px - 16px)' : '350px',
        }}
      >
        <div
          role="button"
          tabIndex={0}
          className={clsx(
            'bg-gray-6 dark:bg-dark-100 text-dark-50 absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center',
            'overflow-hidden rounded-full bg-opacity-80 dark:text-white',
            'opacity-0 transition-opacity group-hover:opacity-100',
          )}
          onClick={(e) => {
            e.stopPropagation()
            if (props.getToastId) toast.dismiss(props.getToastId())
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
        <div className="relative min-w-0 flex-shrink flex-grow break-all pr-10 leading-[1.5]">
          <p className="mb-1 truncate text-[1.05em] font-medium leading-none">
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

        <div className="text-gray-2 absolute right-4 top-4 self-start text-[0.8em]">
          <RelativeTime date={date.current} />
        </div>
      </div>
    </ImpressionView>
  )
})
