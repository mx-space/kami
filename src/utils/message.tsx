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
} from 'components/universal/Message'
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
  message[type] = (content, duration = 2500) => {
    requestAnimationFrame(() => {
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

        const fragment = document.createElement('div')

        ReactDOM.render(
          <Message type={type as any} duration={time} message={message} />,
          fragment,
        )
        setTimeout(() => {
          // react dom can not remove document fragment
          // NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
          ReactDOM.unmountComponentAtNode(fragment)
          container.removeChild(fragment)
          // 加 500ms 动画时间
        }, time + 500)
        container.appendChild(fragment)
        return fragment
        // eslint-disable-next-line no-empty
      } catch {}
    })
  }
})

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
