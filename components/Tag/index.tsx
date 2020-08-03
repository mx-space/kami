import styles from './index.module.scss'
import rc from 'randomcolor'
import { FC } from 'react'
import { observer } from 'mobx-react'
import { useStore } from 'common/store'

interface BigTagProps {
  tagName: string
}
export const BigTag: FC<BigTagProps> = observer(({ tagName }) => {
  const { appStore } = useStore()
  const bgColor = rc({
    format: 'hex',
    luminosity: appStore.colorMode == 'dark' ? 'dark' : 'bright',
  })
  return (
    <div className={styles['tag']} style={{ background: bgColor }}>
      {tagName}
    </div>
  )
})
