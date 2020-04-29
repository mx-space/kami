import { FC } from 'react'
import dynamic from 'next/dynamic'
import range from 'lodash/range'
import { Link } from 'react-scroll'
import styles from './index.module.scss'
import { observer } from 'mobx-react'
import { useStore } from 'store'

export const Toc: FC = observer(() => {
  const { appStore } = useStore()
  const { viewport } = appStore
  if (viewport.mobile) {
    return null
  }
  const $write = document.getElementById('write')
  const headings = range(1, 6)
    .map((h) => Array.from($write?.querySelectorAll('h' + h) || []))
    .flat(2)
    .map((d: HTMLHeadingElement) => d.innerText)

  return (
    <section className="paul-lister">
      <div className="container">
        {headings.map((heading, i) => {
          return (
            <Link
              to={heading}
              key={i}
              offset={-100}
              activeClass={styles['active']}
            >
              <span className={styles['a-pointer']}>{heading}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
})
export default (dynamic(() => import('.').then((m) => m.Toc) as any, {
  ssr: false,
}) as any) as typeof Toc
