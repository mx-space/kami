/*
 * @Author: Innei
 * @Date: 2021-02-03 20:33:57
 * @LastEditTime: 2021-02-03 20:51:07
 * @LastEditors: Innei
 * @FilePath: /web/components/Header/index.tsx
 * @Mark: Coding with Love
 */
import { FC } from 'react'
import styles from './index.module.scss'
import css from './index.module.css'

export const Header: FC = () => {
  return (
    <header className={css['header']}>
      <nav></nav>
    </header>
  )
}

export default Header
