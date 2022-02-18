import clsx from 'clsx'
import { ImageLazy } from 'components/universal/Image'
import { FC, memo, useEffect, useRef, useState } from 'react'

export const ProjectIcon: FC<{ avatar?: string; name?: string }> = memo(
  (props) => {
    return (
      <div
        className={clsx(
          'project-icon flex-shrink-0 flex-grow flex items-center justify-center bg-light-bg',
          props.avatar ? '' : 'bg-gray text-white',
        )}
      >
        {props.avatar ? (
          <ImageLazy src={props.avatar} alt={props.name} />
        ) : (
          <FlexText
            text={props.name?.charAt(0).toUpperCase() || ''}
            size={0.5}
          />
        )}
      </div>
    )
  },
)

// TODO: wait for new CSS unit
const FlexText: FC<{ text: string; size: number }> = memo((props) => {
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
