import rc from 'randomcolor'
import type { FC, MouseEventHandler } from 'react'
import { memo, useMemo } from 'react'

import { useAppStore } from '~/atoms/app'
import { MdiTagHeartOutline } from '~/components/ui/Icons/for-note'

import styles from './index.module.css'

interface BigTagProps {
  tagName: string
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined
}
export const BigTag: FC<BigTagProps> = memo(({ tagName, onClick }) => {
  const colorMode = useAppStore((state) => state.colorMode)
  const bgColor = useMemo(
    () =>
      rc({
        format: 'hex',
        luminosity: colorMode == 'dark' ? 'dark' : 'light',
        seed: tagName,
      }),
    [colorMode, tagName],
  )
  return (
    <a
      className={styles['tag']}
      style={{ background: bgColor }}
      onClick={onClick}
    >
      <MdiTagHeartOutline className="mr-2 inline-block text-lg" />
      {tagName}
    </a>
  )
})
