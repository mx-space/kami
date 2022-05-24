import clsx from 'clsx'
import type { FC } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useClickAway } from 'react-use'
import { isClientSide } from 'utils'

import type { UseFloatingProps } from '@floating-ui/react-dom'
import { flip, offset, shift, useFloating } from '@floating-ui/react-dom'

import styles from './index.module.css'

export const FloatPopover: FC<
  {
    triggerComponent: FC
    headless?: boolean
    wrapperClassNames?: string
    trigger?: 'click' | 'hover' | 'both'
  } & UseFloatingProps
> = (props) => {
  const {
    headless = false,
    wrapperClassNames,
    triggerComponent: TriggerComponent,
    trigger = 'hover',
    ...rest
  } = props

  const { x, y, reference, floating, strategy, update } = useFloating({
    middleware: rest.middleware ?? [flip({ padding: 20 }), offset(10), shift()],
    strategy: rest.strategy,
    placement: rest.placement ?? 'bottom-start',
    whileElementsMounted: rest.whileElementsMounted,
  })
  const [currentStatus, setCurrentStatus] = useState(false)
  const [open, setOpen] = useState(false)
  const updateOnce = useRef(false)
  const doPopoverShow = useCallback(() => {
    setCurrentStatus(true)

    if (!updateOnce.current) {
      requestAnimationFrame(() => {
        update()
        updateOnce.current = true
      })
    }
  }, [])

  const containerAnchorRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerAnchorRef.current) {
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
    const nextElementSibling = containerAnchorRef.current
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

  useClickAway(containerRef, () => {
    if (trigger == 'click' || trigger == 'both') {
      doPopoverDisappear()
      clickTriggerFlag.current = false
    }
  })

  const doPopoverDisappear = useCallback(() => setCurrentStatus(false), [])

  const clickTriggerFlag = useRef(false)
  const handleMouseOut = useCallback(() => {
    if (clickTriggerFlag.current === true) {
      return
    }
    doPopoverDisappear()
  }, [])
  const handleClickTrigger = useCallback(() => {
    clickTriggerFlag.current = true
    doPopoverShow()
  }, [])

  const listener = useMemo(() => {
    switch (trigger) {
      case 'click':
        return {
          onClick: doPopoverShow,
        }
      case 'hover':
        return {
          onMouseOver: doPopoverShow,
          onMouseOut: doPopoverDisappear,
        }
      case 'both':
        return {
          onClick: handleClickTrigger,
          onMouseOver: doPopoverShow,
          onMouseOut: handleMouseOut,
        }
    }
  }, [
    doPopoverDisappear,
    doPopoverShow,
    handleClickTrigger,
    handleMouseOut,
    trigger,
  ])

  if (!isClientSide()) {
    return null
  }

  return (
    <>
      <div
        className={clsx('inline-block', wrapperClassNames)}
        ref={reference}
        {...listener}
      >
        <TriggerComponent />
      </div>

      {createPortal(
        <div
          className="float-popover"
          {...(trigger === 'hover' || trigger === 'both' ? listener : {})}
          ref={containerRef}
        >
          <div ref={containerAnchorRef}></div>
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
