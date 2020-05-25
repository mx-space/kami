import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { Image } from 'components/Image'
import { pick } from 'lodash'
import Link from 'next/link'
import { FC, forwardRef } from 'react'
import { SectionWrap } from './section'
import styles from './index.module.scss'
import { MouseEvent } from 'react'
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

const SectionNews: FC<SectionNewsProps> = forwardRef((props, ref: any) => {
  const { content, size = 6, ...rest } = props

  return (
    <SectionWrap {...rest} ref={ref}>
      {content.map((item, i) => {
        return (
          <div className={`col-${size} col-m-3`} key={i}>
            <Link {...pick(item, ['href', 'as'])}>
              <a className="news-article">
                <Image src={item.background} alt={item.title} />
                <h4>{item.title}</h4>
              </a>
            </Link>
          </div>
        )
      })}
    </SectionWrap>
  )
})

interface SectionCardProps {
  title: string
  desc: string
  src: string
  href?: string
  onClick?: (
    event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
  ) => void
}

export const SectionCard: FC<SectionCardProps> = ({
  title,
  desc,
  src,
  onClick,
  href,
}) => {
  return (
    <div className={`col-6 col-m-3`} style={{ marginTop: '2rem' }}>
      <a href={href} className={'news-article'} onClick={onClick}>
        <div className={styles['mask']}></div>
        <h2 className={styles['bt']}>{title}</h2>
        <Image src={src} alt={title} />
        <h4>
          <span style={{ marginLeft: '1rem' }}>{desc}</span>
        </h4>
      </a>
    </div>
  )
}

export default SectionNews
