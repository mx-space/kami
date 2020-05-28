import {
  FC,
  forwardRef,
  DetailedHTMLProps,
  HTMLAttributes,
  useState,
} from 'react'
import styles from './index.module.scss'
import classNames from 'classnames'
import { SketchPicker } from 'react-color'
import ReactDOM from 'react-dom'
import { stopEventDefault } from '../../../utils/dom'
import QueueAnim from 'rc-queue-anim'
interface SettingProps {}
// @ts-ignore
export const Setting: FC<
  SettingProps &
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = forwardRef((props, ref: any) => {
  const { ...rest } = props
  const [pos, setPos] = useState<{ x: number; y: number }>({} as any)
  const [show, setShow] = useState(false)
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
              <input type="text" />
            </div>
            <div className={styles['item']}>
              <span>颜色~</span>
              <button
                className={'btn blue'}
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
                {show ? <ColorPicker key={'picker'} /> : null}
              </QueueAnim>
            </div>
          </form>
        </section>
        <div className={styles['footer']}>
          <button className={classNames('btn', 'green')}>保存</button>
        </div>
      </div>
    </div>
  )
})

const ColorPicker = ({ x, y }: { x?: number; y?: number }) => {
  return ReactDOM.createPortal(<SketchPicker />, document.body)
}
