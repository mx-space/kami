import {
  faCreativeCommons,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './index.module.scss'

type BaseAction = {
  icon: IconDefinition
  name: string
}

export interface ActionProps {
  informs: BaseAction[]
  actions: (BaseAction & {
    callback: () => void
  })[]
}

export default function Action(props: ActionProps) {
  const { actions = [], informs = [] } = props

  return (
    <>
      <div className="note-inform">
        {informs.map((inform, index) => {
          return (
            <span key={index}>
              <FontAwesomeIcon icon={inform.icon} className={styles.icon} />
              {inform.name}
            </span>
          )
        })}

        <a
          href="https://creativecommons.org/licenses/by-nc-sa/3.0/cn/"
          style={{ color: 'currentColor' }}
          // eslint-disable-next-line react/jsx-no-target-blank
          target={'_blank'}
        >
          <span
            title={
              '署名-非商业性使用-相同方式共享 3.0 中国大陆 (CC BY-NC-SA 3.0 CN)'
            }
          >
            <FontAwesomeIcon icon={faCreativeCommons} className={styles.icon} />
          </span>
        </a>
      </div>
      <div className="note-action">
        {actions.map((action) => {
          return (
            <span
              key={action.name}
              style={{ cursor: 'pointer' }}
              onClick={action.callback}
            >
              <FontAwesomeIcon icon={action.icon} className={styles.icon} />
              {action.name}
            </span>
          )
        })}
      </div>
    </>
  )
}
