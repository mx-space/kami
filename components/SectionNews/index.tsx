import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { Image } from 'components/Image'
import { pick, shuffle } from 'lodash'
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
  const extraImages = shuffle(
    [
      'qsNmnC2zHB5FW41.jpg',
      'GwJzq4SYtClRcZh.jpg',
      '6nOYcygRGXvpsFd.jpg',
      'Qr2ykmsEFpJn4BC.jpg',
      'KiOuTlCzge7JHh3.jpg',
      'sM2XCJTW8BdUe5i.jpg',
      '18KQYP9fNGbrzJu.jpg',
      'rdjZo6Sg2JReyiA.jpg',
      'X2MVRDe1tyJil3O.jpg',
      'EDoKvz5p7BXZ46U.jpg',
      'EGk4qUvcXDygV2z.jpg',
      '5QdwFC82gT3XPSZ.jpg',
      'KPyTCARHBzpxJ46.jpg',
      '7TOEIPwGrZB1qFb.jpg',
      'Ihj5QAZgVMqr9fJ.jpg',
      'KZ6jv8C92Vpwcih.jpg',
    ].map((i) => 'https://i.loli.net/2020/05/22/' + i),
  )
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
