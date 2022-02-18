/*
 * @Author: Innei
 * @Date: 2021-02-04 13:27:29
 * @LastEditTime: 2021-06-24 22:05:27
 * @LastEditors: Innei
 * @FilePath: /web/components/Dropdown/index.tsx
 * @Mark: Coding with Love
 */

import classNames from 'clsx'
import React, { forwardRef } from 'react'
import ReactDOM from 'react-dom'
import { isServerSide } from 'utils'
import styles from './index.module.css'

export type DropDownProps = {
  width: number
  x: number
  y: number
  onLeave: () => void
  onEnter?: () => void
}
export const DropdownBase = forwardRef<
  HTMLDivElement,
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>((props, ref) => {
  if (isServerSide()) {
    return <div ref={ref}></div>
  }
  const { className, ...rest } = props
  return ReactDOM.createPortal(
    <div
      ref={ref}
      className={classNames('fixed', styles['dropdown'], className)}
      {...rest}
    >
      {props.children}
    </div>,
    document.body,
  )
})
