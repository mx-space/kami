import { createContext, useContext } from 'react'

import type { ArticleLayoutProps } from '.'

export type ArticleLayoutContextProps = ArticleLayoutProps

const ArticleLayoutContext = createContext<ArticleLayoutContextProps>({})
export const ArticleLayoutContextProvider = ArticleLayoutContext.Provider
export const useArticleLayoutProps = () => useContext(ArticleLayoutContext)
