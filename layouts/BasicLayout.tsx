import { Footer } from 'components/Footer'

import Header from 'components/Header'
import { observer } from 'mobx-react'
import dynamic from 'next/dynamic'
const APlayer = dynamic(() => import('components/Player'), {
  ssr: false,
})

export const BasicLayout = observer(({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <APlayer />
    </>
  )
})
