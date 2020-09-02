import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { ImageLazy } from 'components/Image'
import pick from 'lodash/pick'
import Link from 'next/link'
import { FC, forwardRef, memo, MouseEvent } from 'react'
import styles from './index.module.scss'
import { SectionWrap } from './section'
export interface SectionNewsProps {
  title: string
  icon: IconDefinition
  moreUrl: string
  color?: string
  content: {
    _id: string
    title: string
    href: string
    as?: string
    background: string
  }[]
  size?: 4 | 6
}

interface CardProps {
  cover: string
  shade?: boolean
  title?: string
}

const Card: FC<CardProps> = (props) => {
  const { cover, shade = true, title, children } = props
  return (
    <div className={styles['card-container']}>
      <div className={styles['card-cover-wrap']}>
        <ImageLazy src={cover} />
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
    const { content, size = 6, ...rest } = props

    return (
      <SectionWrap {...rest} ref={ref}>
        {content.map((item, i) => {
          return (
            <div className={`col-${size} col-m-3`} key={i}>
              <Link {...pick(item, ['href', 'as'])}>
                <a className={styles['news-article']}>
                  <Card cover={item.background}>
                    <span>{item.title}</span>
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

export const SectionCard: FC<SectionCardProps> = memo(
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
