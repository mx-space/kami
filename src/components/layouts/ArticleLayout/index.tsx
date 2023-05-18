import { clsx } from 'clsx'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import { forwardRef, memo, useMemo } from 'react'

import { BottomToUpTransitionView } from '~/components/ui/Transition/BottomToUpTransitionView'

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
      {
        children,
        title,
        subtitle,
        delay,
        type,
        id,
        titleAnimate,
        className,
        ...rest
      },
      ref: any,
    ) => {
      return (
        <ArticleLayoutContextProvider
          value={useMemo(
            () => ({ title, id, subtitle, type }),
            [id, subtitle, title, type],
          )}
        >
          <main
            className={clsx(styles['is-article'], className)}
            ref={ref}
            {...rest}
            id="article-wrap"
            data-type={type}
          >
            <ArticleLayoutTitle animate={titleAnimate} />
            <BottomToUpTransitionView
              in
              timeout={useMemo(() => ({ enter: delay ?? 300 }), [delay])}
              key={id}
            >
              {children}
            </BottomToUpTransitionView>
          </main>
        </ArticleLayoutContextProvider>
      )
    },
  ),
)
