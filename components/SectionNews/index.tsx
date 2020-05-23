import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { Image } from 'components/Image'
import { pick } from 'lodash'
import Link from 'next/link'
import { FC, forwardRef } from 'react'
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

const SectionNews: FC<SectionNewsProps> = forwardRef((props, ref: any) => {
  const { content, size = 6 } = props

  return (
    <SectionWrap {...props} ref={ref}>
      {content.map((item, i) => {
        return (
          <div className={`col-${size} col-m-3`} key={i}>
            <Link {...pick(item, ['href', 'as'])}>
              <a className="news-article">
                <Image
                  src={item.background}
                  alt={item.title}
                  isAbsolute={true}
                />
                <h4>{item.title}</h4>
              </a>
            </Link>
          </div>
        )
      })}
    </SectionWrap>
  )
})

export default SectionNews
