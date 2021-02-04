/*
 * @Author: Innei
 * @Date: 2021-02-04 13:27:29
 * @LastEditTime: 2021-02-04 13:42:45
 * @LastEditors: Innei
 * @FilePath: /web/components/Dropdown/index.tsx
 * @Mark: Coding with Love
 */

import classNames from 'classnames'
import { throttle } from 'lodash'
import dynamic from 'next/dynamic'
import RcQueueAnim from 'rc-queue-anim'
import React, { FC, useState, useEffect, Fragment } from 'react'
import ReactDOM from 'react-dom'
import styles from './index.module.css'

export type DropDownProps = {
  width: number
  x: number
  y: number
  onLeave: () => void
  onEnter?: () => void
}

const _DropDown: FC<DropDownProps> = (props) => {
  const { onLeave, width, x, y } = props

  const Comp = (
    <div
      className={classNames('fixed', styles['dropdown'])}
      style={{ width: `${width}px`, left: `${x}px`, top: `${y}px` }}
      key={x.toString()}
      onMouseLeave={() => {
        onLeave()
      }}
      onMouseEnter={props.onEnter && throttle(props.onEnter, 50)}
    >
      {props.children}
    </div>
  )

  return ReactDOM.createPortal(Comp, document.body)
}
export const DropDown = dynamic(() => Promise.resolve(_DropDown), {
  ssr: false,
})
