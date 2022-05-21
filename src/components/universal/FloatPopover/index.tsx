import type { FC } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { isClientSide } from 'utils'

import type { Placement, Strategy } from '@floating-ui/react-dom'
import { flip, offset, shift, useFloating } from '@floating-ui/react-dom'

import styles from './index.module.css'

export const FloatPopover: FC<{
  triggerComponent: FC
  headless?: boolean
  placement?: Placement
  strategy?: Strategy
}> = (props) => {
  const { x, y, reference, floating, strategy, update } = useFloating({
    middleware: [flip({ padding: 20 }), offset(10), shift()],
    strategy: props.strategy,
    placement: props.placement ?? 'bottom-start',
  })
  const { headless = false } = props
  const TriggerComponent = props.triggerComponent
  const [currentStatus, setCurrentStatus] = useState(false)
  const [open, setOpen] = useState(false)

  const handleMouseOver = useCallback(() => {
    setCurrentStatus(true)

    requestAnimationFrame(() => {
      update()
    })
  }, [])

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    if (currentStatus) {
      setOpen(true)
      requestAnimationFrame(() => {
        handleTransition('in')
      })
    } else {
      requestAnimationFrame(() => {
        handleTransition('out')
      })
    }
  }, [currentStatus])

  const handleTransition = (status: 'in' | 'out') => {
    const nextElementSibling = containerRef.current
      ?.nextElementSibling as HTMLDivElement

    if (!nextElementSibling) {
      return
    }

    if (status === 'in') {
      nextElementSibling.ontransitionend = null
      nextElementSibling?.classList.add(styles.show)
    } else {
      nextElementSibling?.classList.remove(styles.show)
      nextElementSibling!.ontransitionend = () => {
        setOpen(false)
      }
    }
  }

  const handleMouseOut = useCallback(() => setCurrentStatus(false), [])

  if (!isClientSide()) {
    return null
  }
  return (
    <>
      <div
        className="inline-block"
        ref={reference}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <TriggerComponent />
      </div>

      {createPortal(
        <div className="float-popover">
          <div ref={containerRef}></div>
          {open && (
            <div
              className={headless ? '' : styles['popover-root']}
              ref={floating}
              style={{
                position: strategy,
                top: y ?? '',
                left: x ?? '',
              }}
            >
              {props.children}
            </div>
          )}
        </div>,
        document.body,
      )}
    </>
  )
}
