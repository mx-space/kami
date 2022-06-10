import pick from 'lodash-es/pick'
import Link from 'next/link'
import type { FC, MouseEvent, ReactNode } from 'react'
import { forwardRef, memo } from 'react'

import { ImageLazy } from '~/components/universal/Image'

import styles from './index.module.css'
import { SectionWrap } from './section'

export interface SectionNewsProps {
  title: string
  icon: ReactNode
  moreUrl: string
  color?: string
  content: {
    id: string
    title: string
    href: string
    as?: string
    background: string
  }[]
}

interface CardProps {
  cover: string
  shade?: boolean
  title?: string

  children?: ReactNode
}

const Card: FC<CardProps> = (props) => {
  const { cover, shade = true, title, children } = props
  return (
    <div className={styles['card-container']}>
      <div className={styles['card-cover-wrap']}>
        <ImageLazy src={cover} className="dark:brightness-50 dark:filter" />
      </div>
      <div className={styles['card-header']}></div>
      {title && (
        <div className={styles['card-title']}>
          <h3>{title}</h3>
        </div>
      )}
      <div className={styles['card-body']}>{children}</div>
      {shade && <div className={styles['text-shade']} />}
    </div>
  )
}

const SectionNews: FC<SectionNewsProps> = memo(
  forwardRef((props, ref: any) => {
    const { content, ...rest } = props

    return (
      <SectionWrap {...rest} ref={ref}>
        {content.map((item, i) => {
          return (
            <div key={i}>
              <Link {...pick(item, ['href', 'as'])}>
                <a className={styles['news-article']}>
                  <Card cover={item.background}>
                    <div className={styles['text-mask']}>
                      <span>{item.title}</span>
                    </div>
                  </Card>
                </a>
              </Link>
            </div>
          )
        })}
      </SectionWrap>
    )
  }),
)

interface SectionCardProps {
  title: string
  desc: string
  src: string
  href?: string
  onClick?: (
    event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
  ) => void
}

export const SectionCard = memo<SectionCardProps>(
  ({ title, desc, src, onClick, href }) => {
    return (
      <div className={`col-6 col-m-3`} style={{ marginTop: '2rem' }}>
        <a className={styles['news-article']} href={href} onClick={onClick}>
          <Card cover={src} title={title}>
            <span>{desc}</span>
          </Card>
        </a>
      </div>
    )
  },
)

export default SectionNews
