import { clsx } from 'clsx'
import type { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from 'react'
import { Fragment, createElement, memo } from 'react'

import { FloatPopover } from '~/components/ui/FloatPopover'
import { EntypoCreativeCommons } from '~/components/ui/Icons/for-post'

import styles from './index.module.css'

export type BaseAction = {
  icon?: JSX.Element
  name: string | number | JSX.Element
  color?: string
  tip?: string | JSX.Element | FC

  wrapperComponent?: FC<{ children: ReactNode }>
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
    <div className={styles.root}>
      <div className="note-inform space-x-3" {...rest}>
        {informs.map((inform, index) => {
          const Inner = (
            <span className="inline-flex items-center space-x-2">
              {inform.icon && (
                <span
                  className="mr-2 flex items-center"
                  style={{ color: inform.color }}
                >
                  {inform.icon}
                </span>
              )}
              {inform.name}
            </span>
          )
          return (
            <Fragment key={index}>
              {inform.tip ? (
                <FloatPopover
                  triggerComponent={() => Inner}
                  wrapperClassNames="inline-flex items-center"
                >
                  {mountJSXElementOrFC(inform.tip)}
                </FloatPopover>
              ) : (
                Inner
              )}
            </Fragment>
          )
        })}

        {copyright && (
          <a
            href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
            target="_blank"
            className="inline-flex cursor-pointer items-center text-current" rel="noreferrer"
          >
            <span
              title="创作共用保留署名-非商业-禁止演绎4.0国际许可证"
              className="inline-flex items-center"
            >
              <EntypoCreativeCommons />
            </span>
          </a>
        )}
      </div>

      <div className="note-action min-h-4 space-x-4" data-hide-print>
        {actions.map((action, i) => {
          if (!action) {
            return null
          }
          const { wrapperComponent } = action
          const Wrapper = wrapperComponent || Fragment
          const Inner = (
            <span
              className={clsx(
                !!action.callback && 'cursor-pointer',
                'inline-flex items-center space-x-2',
              )}
              onClick={action.callback}
            >
              <Wrapper>
                {action.icon && (
                  <span
                    className="inline-flex items-center"
                    style={{ color: action.color }}
                  >
                    {action.icon}
                  </span>
                )}
                {action.name}
              </Wrapper>
            </span>
          )
          return (
            <Fragment key={i}>
              {action.tip ? (
                <FloatPopover
                  triggerComponent={() => Inner}
                  wrapperClassNames="inline-flex items-center"
                >
                  {mountJSXElementOrFC(action.tip)}
                </FloatPopover>
              ) : (
                Inner
              )}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
})

const mountJSXElementOrFC = (render: FC | ReactNode | JSX.Element) => {
  if (typeof render === 'function') {
    return createElement(render as any)
  }
  return render
}
