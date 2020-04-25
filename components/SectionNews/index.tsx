import { FC } from 'react'
import {
  IconDefinition,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { pick } from 'lodash'
import styles from './index.module.scss'
import randomColor from 'randomcolor'
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

const SectionNews: FC<SectionNewsProps> = (props) => {
  const {
    title,
    icon,
    moreUrl,
    content,
    size = 6,
    color = randomColor({ luminosity: 'dark' }),
  } = props

  return (
    <section className="paul-news">
      <style jsx>{`
        svg {
          top: 0;
          left: 0;
          padding: 1rem 1em;
          position: absolute;
          border-radius: 1em;
          background: rgba(0, 0, 0, 0.1);
        }
        .title::before {
          content: '';
          width: 3rem;
          border-radius: 1rem;
          height: 100%;
          background: rgba(0, 0, 0, 0.2);
          position: absolute;
          left: 0;
          top: 0;
        }
      `}</style>
      <div className="news-item">
        <div className="news-head">
          <h3 className="title" style={{ backgroundColor: color }}>
            <FontAwesomeIcon icon={icon} className={styles.icon} />
            {title}
          </h3>
          <h3 className="more" style={{ backgroundColor: color }}>
            <Link href={moreUrl}>
              <a>
                <FontAwesomeIcon icon={faChevronRight} />
              </a>
            </Link>
          </h3>
        </div>
        <div className="news-body">
          <div className="row s">
            {content.map((item, i) => {
              return (
                <div className={`col-${size} col-m-3`} key={i}>
                  <Link {...pick(item, ['href', 'as'])}>
                    <a className="news-article">
                      <img
                        src="//paul.ren/static/img/article/14.jpg"
                        alt={item.title}
                      />
                      <h4>{item.title}</h4>
                    </a>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SectionNews
