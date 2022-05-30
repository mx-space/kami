import type { FC } from 'react'

import { genSpringKeyframes } from '~/utils/spring'

const [name] = genSpringKeyframes(
  'text-up',
  { translateY: '10px', opacity: 0 },
  { translateY: '0px', opacity: 1 },
)

export const TextFade: FC<
  {
    text?: string
    children?: string
    duration?: number
    delay?: number
    appear?: boolean
  } & JSX.IntrinsicElements['div']
> = (props) => {
  const {
    duration = 500,
    appear = true,
    delay = 100,
    children,
    text,
    ...rest
  } = props
  if (!appear) {
    return <div {...rest}>{text ?? children}</div>
  }
  return (
    <div {...rest}>
      {Array.from(text ?? (children as string)).map((char, i) => (
        <span
          key={i}
          className="inline-block whitespace-pre"
          style={{
            animation: `${name} ${duration}ms both linear`,
            animationDelay: `${i * delay}ms`,
          }}
        >
          {char}
        </span>
      ))}
    </div>
  )
}
