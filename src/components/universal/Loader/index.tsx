import type { FC } from 'react'
import { memo, useRef } from 'react'

import { CustomLogo } from '~/components/universal/Logo'

const Loader: FC = memo(() => {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <>
      <div className="loader" ref={ref}></div>
      <div className="loader-logo">
        <CustomLogo
          className="animation"
          height="150px"
          onAnimationEnd={(e) => {
            ref.current?.remove()
            ;(e.target as any)?.remove()
          }}
        />
      </div>
    </>
  )
})

export default Loader
