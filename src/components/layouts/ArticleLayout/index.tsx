import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { forwardRef, memo, useMemo } from 'react'

import { BottomUpTransitionView } from '~/components/universal/Transition/bottom-up'

import { ArticleLayoutContextProvider } from './hooks'
import styles from './index.module.css'
import { ArticleLayoutTitle } from './title'

export interface ArticleLayoutProps {
  title?: string
  subtitle?: string | string[]
  titleAnimate?: boolean
  subtitleAnimation?: boolean
  delay?: number

  type?: 'post' | 'page'
  id?: string
}

export const ArticleLayout = memo(
  forwardRef<
    HTMLElement,
    ArticleLayoutProps &
      DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
  >(
    (
      { children, title, subtitle, delay, type, id, titleAnimate, ...rest },
      ref: any,
    ) => {
      return (
        <ArticleLayoutContextProvider value={{ title, id, subtitle, type }}>
          <main
            className={styles['is-article']}
            ref={ref}
            {...rest}
            id={'article-wrap'}
            data-type={type}
          >
            <ArticleLayoutTitle animate={titleAnimate} />
            <BottomUpTransitionView
              timeout={useMemo(() => ({ enter: delay ?? 300 }), [delay])}
              key={id}
            >
              {children}
            </BottomUpTransitionView>
          </main>
        </ArticleLayoutContextProvider>
      )
    },
  ),
)
