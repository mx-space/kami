import { CustomLogo } from 'components/Logo'
import { FC, memo, useRef } from 'react'

const Loader: FC = memo(() => {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <>
      <div className="loader" ref={ref}>
        {/* <div className="animation">
            <CustomLogo />
          </div> */}
      </div>
      <div className="loader-logo">
        <CustomLogo
          className="animation"
          height="150px"
          // viewBox="0 0 100 100"
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
