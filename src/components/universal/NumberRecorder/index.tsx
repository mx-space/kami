import type { FC } from 'react'
import { memo } from 'react'
import NumberCounter from 'react-smooth-number-counter'

interface NumberRecorderProps {
  number: number
  className?: string
}

export const NumberTransition: FC<NumberRecorderProps> = memo((props) => {
  return (
    <NumberCounter
      value={props.number}
      transition={500}
      className={props.className}
    />
  )
})
