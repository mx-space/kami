import { FC } from 'react'
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
    return <div {...rest}>{text || children}</div>
  }
  return (
    <div {...rest}>
      {Array.from(text || (children as string)).map((char, i) => (
        <span
          key={char}
          className="inline-block"
          style={{
            animation: `fade-up ${duration}ms both`,
            animationDelay: `${i * delay}ms`,
          }}
        >
          {char}
        </span>
      ))}
    </div>
  )
}
