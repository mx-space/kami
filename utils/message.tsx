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
;['success', 'error', 'warn', 'info', 'loading'].forEach((type) => {
  message[type] = (content, duration) => {
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

    ReactDOM.render(
      <Message type={type as any} duration={time} message={message} />,
      fragment,
    )
    container.appendChild(fragment)
    return fragment
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
  loading(content: JointContent, duration?: ConfigDuration): void
}
