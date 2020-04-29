import isNull from 'lodash/isNull'
import range from 'lodash/range'
import throttle from 'lodash/throttle'
import { observer } from 'mobx-react'
import dynamic from 'next/dynamic'
import { FC, useEffect, useState } from 'react'
import { Link } from 'react-scroll'
import { useStore } from 'store'
import styles from './index.module.scss'
export const Toc: FC = observer(() => {
  const { appStore } = useStore()
  const { viewport } = appStore
  if (viewport.mobile) {
    return null
  }
  const [headings, setHeadings] = useState<null | string[]>([])
  const getHeadings = throttle(() => {
    const $write = document.getElementById('write')
    if (!$write) {
      return getHeadings()
    }
    const $headings = range(1, 6).map((h) =>
      Array.from($write.querySelectorAll('h' + h)),
    )
    if (isNull(headings)) {
      return
    }
    if (headings.length === 0) {
      const headings = $headings
        .flat(2)
        .map((d: HTMLHeadingElement) => d.innerText)
      setHeadings(headings.length === 0 ? null : headings)
    }
  }, 20)
  useEffect(() => {
    setTimeout(() => {
      getHeadings()
    }, 1000)
  })

  return (
    <section className="paul-lister">
      <div className="container">
        {headings &&
          headings.map((heading, i) => {
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
