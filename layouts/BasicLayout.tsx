import Header from 'components/Header'

export const BasicLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
