import { CustomLogo } from 'components/Logo'
import { FC, memo } from 'react'

const Loader: FC = memo(() => {
  return (
    <div className="loader">
      <CustomLogo />
    </div>
  )
})

export default Loader
