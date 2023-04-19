import { createContext, useContext } from 'react'

const Context = createContext({ doAnimation: true })
export const HomePageViewProvider = Context.Provider

export const useHomePageViewContext = () => useContext(Context)
