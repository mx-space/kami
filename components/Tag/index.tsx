import { faTag } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useStore } from 'common/store'
import rc from 'randomcolor'
import { FC, MouseEventHandler, useMemo } from 'react'
import { observer } from 'utils/mobx'
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
      }),
    [appStore.colorMode],
  )
  return (
    <a
      className={styles['tag']}
      style={{ background: bgColor }}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faTag} style={{ marginRight: '0.8rem' }} />
      {tagName}
    </a>
  )
})
