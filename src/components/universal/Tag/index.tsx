import { observer } from 'mobx-react-lite'
import rc from 'randomcolor'
import type { FC, MouseEventHandler } from 'react'
import { useMemo } from 'react'

import { MdiTagHeartOutline } from '@mx-space/kami-design/components/Icons/for-note'

import { useStore } from '~/store'

import styles from './index.module.css'

interface BigTagProps {
  tagName: string
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined
}
export const BigTag: FC<BigTagProps> = observer(({ tagName, onClick }) => {
  const { appStore } = useStore()
  const bgColor = useMemo(
    () =>
      rc({
        format: 'hex',
        luminosity: appStore.colorMode == 'dark' ? 'dark' : 'light',
        seed: tagName,
      }),
    [appStore.colorMode, tagName],
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
