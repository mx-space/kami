import rc from 'randomcolor'
import type { FC, MouseEventHandler } from 'react'
import { memo, useMemo } from 'react'

import { MdiTagHeartOutline } from '@mx-space/kami-design/components/Icons/for-note'

import { useAppStore } from '~/atoms/app'

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
      <MdiTagHeartOutline className="inline-block mr-2 text-lg" />
      {tagName}
    </a>
  )
})
