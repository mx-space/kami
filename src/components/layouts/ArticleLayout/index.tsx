import { BottomUpTransitionView } from 'components/universal/Transition/bottom-up'
import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  memo,
  useMemo,
} from 'react'
import { ArticleLayoutContextProvider } from './hooks'
import styles from './index.module.css'
import { ArticleLayoutTitle } from './title'

export interface ArticleLayoutProps {
  title?: string
  subtitle?: string | string[]
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
        subtitleAnimation = true,
        type,
        id,
        ...rest
      },
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
            <ArticleLayoutTitle />
            <BottomUpTransitionView
              timeout={useMemo(() => ({ enter: delay ?? 300 }), [delay])}
              key={id}
            >
              <article className="main-article-md" key={id}>
                {children}
              </article>
            </BottomUpTransitionView>
          </main>
        </ArticleLayoutContextProvider>
      )
    },
  ),
)
