import Link from 'next/link'
import { FC, memo } from 'react'
interface HeaderNavigationProps {
  items: {
    as?: string
    href: string
    title: string
  }[]
  activeIndex: number
}

export const HeaderNavigation: FC<HeaderNavigationProps> = memo((props) => {
  const { items, activeIndex } = props
  return (
    <nav className={'navigation'}>
      {items.map((item, i) => {
        return (
          <Link href={item.href} as={item.as} key={i}>
            <a className={activeIndex === i ? 'active' : ''}>{item.title}</a>
          </Link>
        )
      })}
    </nav>
  )
})
