/*
 * @Author: Innei
 * @Date: 2020-09-25 21:36:04
 * @LastEditTime: 2021-02-07 20:30:31
 * @LastEditors: Innei
 * @FilePath: /web/utils/message.tsx
 * @Mark: Coding with Love
 */
import {
  Message,
  MessageContainer,
  MessageContainerPrefixId,
} from 'components/Message'
import ReactDOM from 'react-dom'
import { isServerSide } from './utils'

let containerNode: HTMLElement | null
// @ts-ignore
const getContainerNode: () => HTMLElement = () => {
  if (isServerSide()) {
    return
  }
  if (!containerNode) {
    const $root = document.getElementById(MessageContainerPrefixId)
    if ($root) {
      containerNode = $root
      return $root
    }
    const $f = document.createDocumentFragment()
    ReactDOM.render(<MessageContainer />, $f)
    document.body.appendChild($f)

    containerNode = document.getElementById(MessageContainerPrefixId)
    return containerNode
  }
  return containerNode
}

//@ts-ignore

const message: MessageInstance = {}
;['success', 'error', 'warn', 'info', 'loading', 'warning'].forEach((type) => {
  message[type] = (content, duration) => {
    try {
      let message: string
      const time = content?.duration ?? duration

      if (typeof content === 'string') {
        message = content
      } else {
        message = content.content
      }
      if (!message) {
        return
      }
      const container = getContainerNode()

      const fragment = document.createDocumentFragment()
      // `time` not millisecond because antd-message implementation, please times 1000
      ReactDOM.render(
        <Message type={type as any} duration={time} message={message} />,
        fragment,
      )
      setTimeout(() => {
        cleanEmptyMessageWrapper()
      }, time * 1000)
      container.appendChild(fragment)
      return fragment
      // eslint-disable-next-line no-empty
    } catch {}
  }
})
const cleanEmptyMessageWrapper = () => {
  const $root = getContainerNode()
  const children = Array.from($root.children)
  for (let i = 0, len = children.length; i < len; i++) {
    const $item = children[i]

    if (!$item) {
      continue
    }
    const isEmpty = ($item as HTMLElement).innerHTML === ''
    if (isEmpty) {
      $root.removeChild($item)
    }
  }
}
export { message }
if ('window' in globalThis) {
  // @ts-ignore
  window.message = message
}
// type NoticeType = 'info' | 'success' | 'error' | 'warning' | 'loading'

export interface ArgsProps {
  content: string
  duration?: number | null
  key?: string | number
}
type JointContent = ConfigContent | ArgsProps
type ConfigContent = string
type ConfigDuration = number | (() => void)
export interface MessageInstance {
  info(content: JointContent, duration?: ConfigDuration): void
  success(content: JointContent, duration?: ConfigDuration): void
  error(content: JointContent, duration?: ConfigDuration): void
  warning(content: JointContent, duration?: ConfigDuration): void
  warn(content: JointContent, duration?: ConfigDuration): void
  loading(content: JointContent, duration?: ConfigDuration): void
}
