import { clsx } from 'clsx'
import { Link } from '~/i18n/navigation'
import randomColor from 'randomcolor'
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, memo } from 'react'

import { useAppStore } from '~/atoms/app'
import { IcBaselineArrowForwardIos } from '~/components/ui/Icons/for-home'

export interface SectionNewsProps {
  title: string
  icon: ReactNode
  moreUrl?: string
  color?: string
  size?: 4 | 6
  ref?: any
  showMoreIcon?: boolean
}

export const SectionWrap = memo(
  forwardRef<
    HTMLDivElement,
    SectionNewsProps &
      DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  >((props, ref) => {
    const {
      title,
      icon,
      moreUrl,
      color = randomColor({
        luminosity: 'dark',
      }),
      showMoreIcon = true,
      className,
      ...rest
    } = props
    const colorMode = useAppStore((state) => state.colorMode)
    return (
      <div className="news-item" ref={ref}>
        <div className="news-head">
          <h3
            className="title"
            style={{
              backgroundColor: color,
              filter: colorMode === 'dark' ? 'brightness(0.8)' : undefined,
            }}
          >
            <div className="z-1 scale-120 absolute left-4 transform">
              {icon}
            </div>

            {title}
          </h3>
          {showMoreIcon && moreUrl && (
            <h3
              className="more"
              style={{
                backgroundColor: color,
                filter: colorMode === 'dark' ? 'brightness(0.8)' : undefined,
              }}
            >
              <Link href={moreUrl}>
                <IcBaselineArrowForwardIos />
              </Link>
            </h3>
          )}
        </div>
        <div className="news-body mb-8 mt-4">
          <div
            className={clsx('grid grid-cols-2 gap-4 sm:grid-cols-4', className)}
            {...rest}
          >
            {props.children}
          </div>
        </div>
      </div>
    )
  }),
)
