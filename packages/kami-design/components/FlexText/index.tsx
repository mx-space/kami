import type { FC } from 'react'
import { memo, useEffect, useRef, useState } from 'react'

// TODO: wait for new CSS unit
export const FlexText: FC<{ text: string; size: number }> = memo((props) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const $el = ref.current
    const $parent = $el.parentElement
    let observe: ResizeObserver
    if ($parent) {
      observe = new ResizeObserver(() => {
        const { width } = $parent.getBoundingClientRect()
        $el.style.fontSize = `${(width / props.text.length) * props.size}px`
        setDone(true)
      })
      observe.observe($parent)
    }

    return () => {
      if (observe) {
        observe.disconnect()
      }
    }
  }, [props.size])
  return (
    <span ref={ref} className={done ? '' : 'invisible'}>
      {props.text}
    </span>
  )
})
