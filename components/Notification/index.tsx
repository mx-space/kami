import { Button, notification } from 'antd'
import { MouseEvent } from 'react'
export interface NotificationProps {
  key?: string
  close?: () => void
  message: string
  description: string
  showBtn?: boolean
  callback?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void
  btnText?: string
}
export const openNotification = ({
  key = `open${Date.now()}`,
  close,
  message,
  description,
  showBtn,
  callback,
  btnText,
}: NotificationProps) => {
  const btn = (
    <Button type="primary" size="small" onClick={callback}>
      {btnText}
    </Button>
  )
  notification.open({
    message,
    description,
    btn: showBtn ? btn : null,
    key,
    onClose: close,
  })
}
