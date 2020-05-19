import {
  faChevronRight,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import LoadingImage from 'assets/images/load.gif'
import { Image } from 'components/Image'
import { pick, shuffle } from 'lodash'
import Link from 'next/link'
import randomColor from 'randomcolor'
import { FC, forwardRef } from 'react'
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

const SectionNews: FC<SectionNewsProps> = forwardRef((props, ref: any) => {
  const { content, size = 6 } = props
  const extraImages = shuffle([
    'https://i.loli.net/2020/04/26/9zMh7AqfTQ8SmwJ.jpg',
    'https://i.loli.net/2020/04/26/GUJHa8wxXt3CScs.png',
    'https://i.loli.net/2020/04/26/sRnTN6QGSyVPhlA.jpg',
    'https://i.loli.net/2020/04/26/CAkdYgHIoabL3ns.png',
  ])
  return (
    <SectionWrap {...props} ref={ref}>
      {content.map((item, i) => {
        return (
          <div className={`col-${size} col-m-3`} key={i}>
            <Link {...pick(item, ['href', 'as'])}>
              <a className="news-article">
                <Image
                  src={item.background ?? extraImages.pop()}
                  alt={item.title}
                  defaultImage={LoadingImage}
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
