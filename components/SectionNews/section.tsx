/*
 * @Author: Innei
 * @Date: 2021-05-13 11:13:00
 * @LastEditTime: 2021-05-28 22:05:03
 * @LastEditors: Innei
 * @FilePath: /web/components/SectionNews/section.tsx
 * Mark: Coding with Love
 */
import {
  faChevronRight,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import randomColor from 'randomcolor'
import { DetailedHTMLProps, FC, forwardRef, HTMLAttributes } from 'react'
import styles from './index.module.scss'
import { observer } from 'utils/mobx'
import { useStore } from '../../common/store'

export interface SectionNewsProps {
  title: string
  icon: IconDefinition
  moreUrl?: string
  color?: string
  size?: 4 | 6
  ref?: any
  showMoreIcon?: boolean
}

export const SectionWrap: FC<
  SectionNewsProps &
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = observer(
  forwardRef((props, ref) => {
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
        <div className="news-item" ref={ref as any}>
          <div className="news-head">
            <h3
              className="title"
              style={{
                backgroundColor: color,
                filter: mode === 'dark' ? 'brightness(0.8)' : undefined,
              }}
              suppressHydrationWarning
            >
              <FontAwesomeIcon icon={icon} className={styles.icon} />
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
                    <FontAwesomeIcon icon={faChevronRight} />
                  </a>
                </Link>
              </h3>
            )}
          </div>
          <div className="news-body">
            <div className="row s" {...rest}>
              {props.children}
            </div>
          </div>
        </div>
      </>
    )
  }),
)
