import classNames from 'clsx'
import { observer } from 'mobx-react-lite'
import QueueAnim from 'rc-queue-anim'
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { message } from 'utils/message'
import { useStore } from '../../../common/store'
import { stopEventDefault } from '../../../utils/dom'
import styles from './index.module.css'

export const STORE_PREFIX = 'mx-space-web-dangmaku'

interface SettingProps {
  setHide: any
}
// @ts-ignore
export const Setting = observer<
  SettingProps &
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>(
  (props, ref: any) => {
    const { ...rest } = props
    const [pos, setPos] = useState<{ x: number; y: number }>({} as any)
    const [show, setShow] = useState(false)
    const [color, setColor] = useState('#2ccce4')
    const [author, setAuthor] = useState('游客')
    const { userStore } = useStore()
    useEffect(() => {
      const json = localStorage.getItem(STORE_PREFIX) as string

      const store = JSON.parse(json || '{}')

      if (
        store &&
        typeof store.color !== 'undefined' &&
        typeof store.author !== 'undefined'
      ) {
        setColor(store.color)
        setAuthor(store.author)
      }
    }, [])
    return (
      <div className={styles['setting']} ref={ref} {...rest}>
        <div className={styles['setting-wrap']}>
          <div className={styles['header']}>
            <div className={styles['title']}>设定</div>
          </div>

          <section>
            <form>
              <div className={styles['item']}>
                <span>昵称~</span>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value)
                  }}
                />
              </div>
              <div className={styles['item']}>
                <span>颜色~</span>
                <button
                  className={'btn blue'}
                  style={{ backgroundColor: color }}
                  onClick={(e) => {
                    stopEventDefault(e)
                    setShow(!show)
                    const $btn = e.target as HTMLButtonElement
                    const rect = $btn.getBoundingClientRect()
                    setPos({
                      x: rect.x,
                      y: rect.y,
                    })
                  }}
                >
                  选择
                </button>
                <QueueAnim>
                  {show ? (
                    <ColorPicker
                      key={'picker'}
                      x={pos.x}
                      y={pos.y - 240}
                      color={color}
                      setColor={setColor}
                    />
                  ) : null}
                </QueueAnim>
              </div>
            </form>
          </section>
          <div className={styles['footer']}>
            <button
              className={classNames('btn', 'green')}
              onClick={(e) => {
                if (
                  (author === userStore.name ||
                    author === userStore.username) &&
                  !userStore.isLogged
                ) {
                  return message.error('你不能使用和站长一样的昵称哦')
                }
                localStorage.setItem(
                  STORE_PREFIX,
                  JSON.stringify({ color, author }),
                )

                props.setHide()
              }}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    )
  },
  { forwardRef: true },
)

const ColorPicker = ({
  x,
  y,
  color,
  setColor,
}: {
  x?: number
  y?: number
  color: string
  setColor: (color: string) => void
}) => {
  // TODO picker 自己写
  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        zIndex: 23,
        top: y ? y + 'px' : undefined,
        left: x ? x + 'px' : undefined,
      }}
      className={'shadow'}
    >
      {/* <Picker
        triangle={'hide'}
        color={color}
        onChange={(color) => setColor(color.hex)}
      /> */}
      <span>Picker</span>
    </div>,
    document.body,
  )
}
