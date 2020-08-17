import styles from './index.module.scss'
import rc from 'randomcolor'
import { FC, useMemo } from 'react'
import { observer } from 'utils/mobx'
import { useStore } from 'common/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTag } from '@fortawesome/free-solid-svg-icons'

interface BigTagProps {
  tagName: string
  onClick?: () => void
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
