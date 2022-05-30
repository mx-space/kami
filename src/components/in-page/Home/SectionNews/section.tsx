import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import randomColor from 'randomcolor'
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

import { IcBaselineArrowForwardIos } from '~/components/universal/Icons'

import { useStore } from '../../../../store'

export interface SectionNewsProps {
  title: string
  icon: ReactNode
  moreUrl?: string
  color?: string
  size?: 4 | 6
  ref?: any
  showMoreIcon?: boolean
}

export const SectionWrap = observer(
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
      ...rest
    } = props
    const { appStore } = useStore()
    const mode = appStore.colorMode
    return (
      <>
        <div className="news-item" ref={ref}>
          <div className="news-head">
            <h3
              className="title"
              style={{
                backgroundColor: color,
                filter: mode === 'dark' ? 'brightness(0.8)' : undefined,
              }}
              suppressHydrationWarning
            >
              <div className="absolute left-4 z-1 transform scale-120">
                {icon}
              </div>

              {title}
            </h3>
            {showMoreIcon && moreUrl && (
              <h3
                className="more"
                style={{
                  backgroundColor: color,
                  filter: mode === 'dark' ? 'brightness(0.8)' : undefined,
                }}
              >
                <Link href={moreUrl}>
                  <a>
                    <IcBaselineArrowForwardIos />
                  </a>
                </Link>
              </h3>
            )}
          </div>
          <div className="news-body">
            <div className="grid sm:grid-cols-4 grid-cols-2 gap-4" {...rest}>
              {props.children}
            </div>
          </div>
        </div>
      </>
    )
  }),
)
