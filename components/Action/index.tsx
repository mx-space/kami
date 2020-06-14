import {
  faCreativeCommons,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DetailedHTMLProps, HTMLAttributes, memo } from 'react'
import styles from './index.module.scss'

type BaseAction = {
  icon: IconDefinition
  name: string | number
  color?: string
}

export interface ActionProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  informs?: BaseAction[]
  actions?: (BaseAction & {
    callback: () => void
  })[]
  copyright?: boolean
}

export default memo(function Action(props: ActionProps) {
  const { actions = [], informs = [], copyright = true, ...rest } = props

  return (
    <>
      <style jsx>{`
        .note-action {
          min-height: 1rem;
        }
      `}</style>
      <div className="note-inform" {...rest}>
        {informs.map((inform, index) => {
          return (
            <span key={index}>
              <FontAwesomeIcon
                icon={inform.icon}
                className={styles.icon}
                color={inform.color}
              />
              {inform.name}
            </span>
          )
        })}

        {copyright && (
          <a
            href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
            style={{ color: 'currentColor' }}
            // eslint-disable-next-line react/jsx-no-target-blank
            target={'_blank'}
          >
            <span title={'创作共用保留署名-非商业-禁止演绎4.0国际许可证'}>
              <FontAwesomeIcon
                icon={faCreativeCommons}
                className={styles.icon}
              />
            </span>
          </a>
        )}
      </div>
      <div className="note-action">
        {actions.map((action) => {
          return (
            <span
              key={action.name}
              style={{ cursor: 'pointer' }}
              onClick={action.callback}
            >
              <FontAwesomeIcon
                icon={action.icon}
                className={styles.icon}
                color={action.color}
              />
              {action.name}
            </span>
          )
        })}
      </div>
    </>
  )
})
