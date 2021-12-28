/*
 * @Author: Innei
 * @Date: 2021-05-29 19:31:30
 * @LastEditTime: 2021-08-28 16:39:26
 * @LastEditors: Innei
 * @FilePath: /web/components/Action/index.tsx
 * Mark: Coding with Love
 */
import {
  faCreativeCommons,
  IconDefinition,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DetailedHTMLProps, HTMLAttributes, memo } from 'react'
import styles from './index.module.css'

type BaseAction = {
  icon?: IconDefinition
  name: string | number | JSX.Element
  color?: string
}

export interface ActionProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  informs?: BaseAction[]
  actions?: (
    | false
    | (BaseAction & {
        callback: () => void
      })
  )[]
  copyright?: boolean
}

export default memo(function Action(props: ActionProps) {
  const { actions = [], informs = [], copyright = true, ...rest } = props

  return (
    <>
      <div className="note-inform" {...rest}>
        {informs.map((inform, index) => {
          return (
            <span key={index}>
              {inform.icon && (
                <FontAwesomeIcon
                  icon={inform.icon}
                  className={styles.icon}
                  color={inform.color}
                />
              )}
              {inform.name}
            </span>
          )
        })}

        {copyright && (
          <a
            href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
            style={{ color: 'currentColor' }}
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
      <div className="note-action" style={{ minHeight: '1rem' }}>
        {actions.map((action, i) => {
          if (!action) {
            return null
          }
          return (
            <span
              key={i}
              style={{ cursor: 'pointer' }}
              onClick={action.callback}
            >
              {action.icon && (
                <FontAwesomeIcon
                  icon={action.icon}
                  className={styles.icon}
                  color={action.color}
                />
              )}
              {action.name}
            </span>
          )
        })}
      </div>
    </>
  )
})
