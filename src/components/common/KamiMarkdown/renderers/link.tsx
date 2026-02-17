import type { FC } from 'react'
import { memo, useCallback, useMemo } from 'react'

import { getPathnameWithoutLocale, useRouter } from '~/i18n/navigation'
import { FloatPopover } from '~/components/ui/FloatPopover'

import styles from './link.module.css'

export const MLink: FC<{
  href: string
  title?: string
  children?: JSX.Element | JSX.Element[]
}> = memo((props) => {
  const ExtendIcon = useMemo(
    () => (
      <svg
        style={{
          transform: `translateY(-2px)`,
          marginLeft: `2px`,
        }}
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        width="15"
        height="15"
        className="inline align-middle leading-normal"
      >
        <path
          fill="var(--shizuku-text-color)"
          d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"
        />
        <polygon
          fill="var(--shizuku-text-color)"
          points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"
        />
      </svg>
    ),
    [],
  )
  const router = useRouter()
  const handleRedirect = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      const href = props.href
      const locateUrl = new URL(location.href)

      const toUrlParser = new URL(href)

      if (
        toUrlParser.host === locateUrl.host ||
        (process.env.NODE_ENV === 'development' &&
          toUrlParser.host === 'innei.ren')
      ) {
        e.preventDefault()
        const pathname = getPathnameWithoutLocale(toUrlParser.pathname)
        router.push(pathname + (toUrlParser.search || ''))
      }
    },
    [props.href, router],
  )

  return (
    <FloatPopover
      as="span"
      wrapperClassNames="!inline"
      triggerComponent={() => (
        <>
          <a
            className={styles['anchor']}
            href={props.href}
            target="_blank"
            onClick={handleRedirect}
            title={props.title}
          >
            {props.children}
          </a>

          {ExtendIcon}
        </>
      )}
    >
      <span>{props.href}</span>
      {/* <iframe
        src={props.href}
        className="mt-2 h-64 w-full overflow-auto border-none outline-none"
        sandbox="allow-scripts allow-same-origin"
      /> */}
    </FloatPopover>
  )
})
