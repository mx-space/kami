import clsx from 'clsx'
import type { HTMLMotionProps, Transition } from 'framer-motion'
import { motion, useDomEvent } from 'framer-motion'
import * as React from 'react'
import { useRef, useState } from 'react'

import { RootPortal } from '../Portal'
import styles from './zoom.module.css'

const transition: Transition = {
  type: 'spring',
  damping: 25,
  stiffness: 120,
}

export const ImageZoom: React.FC<HTMLMotionProps<'img'>> = (props) => {
  const [isOpen, setOpen] = useState(false)

  useDomEvent(useRef(window), 'scroll', () => isOpen && setOpen(false))

  return (
    <div
      className={clsx(styles[`image-container`], isOpen ? styles['open'] : '')}
      style={{
        height: props.style?.height,
        width: props.style?.width,
      }}
    >
      <RootPortal>
        <motion.div
          animate={{ opacity: isOpen ? 1 : 0, pointerEvents: 'none' }}
          transition={transition}
          className={styles['shade']}
          onClick={() => setOpen(false)}
        />
      </RootPortal>

      <motion.img
        {...props}
        onClick={() => setOpen(!isOpen)}
        layout
        transition={transition}
      />
    </div>
  )
}
