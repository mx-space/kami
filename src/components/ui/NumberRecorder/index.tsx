import { clsx } from 'clsx'
import CountUp from 'react-countup'
import type { FC } from 'react'
import { memo } from 'react'
import { usePrevious } from 'react-use'

import { ClientOnly } from '../../app/ClientOnly'

interface NumberRecorderProps {
  number: number
  className?: string
}

export const NumberTransition: FC<NumberRecorderProps> = memo((props) => {
  const prev = usePrevious(props.number)

  return (
    <ClientOnly>
      <CountUp
        start={prev ?? props.number}
        end={props.number}
        duration={0.5}
        className={clsx('inline-block tabular-nums align-baseline', props.className)}
      />
    </ClientOnly>
  )
})
