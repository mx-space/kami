import type { FC, ReactNode } from 'react'

import styles from './index.module.css'

export const TimelineListWrapper: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <ul className={styles['timeline']}>{children}</ul>
}
