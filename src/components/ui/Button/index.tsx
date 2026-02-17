import { clsx } from 'clsx'
import type { HTMLMotionProps } from 'framer-motion'
import { motion } from 'framer-motion'
import type { FC } from 'react'

import { microReboundPreset } from '~/constants/spring'

export const Button: FC<HTMLMotionProps<'button'>> = (props) => {
  const { className, ...rest } = props
  return (
    <motion.button
      className={clsx('btn', className)}
      whileTap={{
        transition: microReboundPreset,
        scale: 0.9,
      }}
      whileHover={{
        shadow:
          '0 0 10px rgb(120 120 120 / 10%), 0 5px 20px rgb(120 120 120 / 20%)',
      }}
      {...rest}
    >
      {props.children}
    </motion.button>
  )
}
