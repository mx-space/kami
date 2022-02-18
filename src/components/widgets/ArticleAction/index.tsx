/*
 * @Author: Innei
 * @Date: 2021-05-29 19:31:30
 * @LastEditTime: 2021-08-28 16:39:26
 * @LastEditors: Innei
 * @FilePath: /web/components/Action/index.tsx
 * Mark: Coding with Love
 */
import { EntypoCreativeCommons } from 'components/universal/Icons'
import { DetailedHTMLProps, FC, HTMLAttributes, memo } from 'react'
import styles from './index.module.css'

type BaseAction = {
  icon?: JSX.Element
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

export const ArticleFooterAction: FC<ActionProps> = memo((props) => {
  const { actions = [], informs = [], copyright = true, ...rest } = props

  return (
    <div className={styles.root} data-hide-print>
      <div className="note-inform space-x-3" {...rest}>
        {informs.map((inform, index) => {
          return (
            <span key={index} className="inline-flex items-center space-x-2">
              {inform.icon && (
                <span
                  className="flex items-center mr-2"
                  style={{ color: inform.color }}
                >
                  {inform.icon}
                </span>
              )}
              {inform.name}
            </span>
          )
        })}

        {copyright && (
          <a
            href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
            target={'_blank'}
            className="inline-flex items-center text-current"
          >
            <span
              title={'创作共用保留署名-非商业-禁止演绎4.0国际许可证'}
              className="inline-flex items-center"
            >
              <EntypoCreativeCommons />
            </span>
          </a>
        )}
      </div>
      <div className="note-action min-h-4 space-x-4">
        {actions.map((action, i) => {
          if (!action) {
            return null
          }
          return (
            <span
              key={i}
              className="cursor-pointer inline-flex items-center space-x-2"
              onClick={action.callback}
            >
              {action.icon && (
                <span className="" style={{ color: action.color }}>
                  {action.icon}
                </span>
              )}
              {action.name}
            </span>
          )
        })}
      </div>
    </div>
  )
})
