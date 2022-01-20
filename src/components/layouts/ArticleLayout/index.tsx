import QueueAnim from 'rc-queue-anim'
import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  memo,
  useCallback,
  useEffect,
} from 'react'
import { animatingClassName } from '../NoteLayout'
import { ArticleLayoutContextProvider } from './hooks'
import styles from './index.module.css'
import { ArticleLayoutTitle } from './title'

export interface ArticleLayoutProps {
  title?: string
  subtitle?: string | string[]
  subtitleAnimation?: boolean
  delay?: number
  focus?: boolean
  type?: 'post' | 'page'
  id?: string
}

const animConfig = { opacity: [1, 0], translateY: [0, 50] }
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
        focus,
        subtitle,
        delay,
        subtitleAnimation = true,
        type,
        id,
        ...rest
      },
      ref: any,
    ) => {
      useEffect(() => {
        if (focus) {
          document.body.classList.add('focus')
        }
        return () => {
          document.body.classList.remove('focus')
        }
      }, [focus])

      return (
        <ArticleLayoutContextProvider
          value={{ title, focus, id, subtitle, type }}
        >
          <main
            className={styles['is-article']}
            ref={ref}
            {...rest}
            id={'article-wrap'}
            data-type={type}
          >
            <ArticleLayoutTitle />
            <QueueAnim
              delay={delay ?? 300}
              duration={500}
              animConfig={animConfig}
              onEnd={useCallback((e) => {
                const { target, type } = e
                if (type === 'enter') {
                  const $t = target as HTMLDivElement
                  $t.style.transform = ''
                }
              }, [])}
              animatingClassName={animatingClassName}
            >
              <article className="post-content kami-note" key={id}>
                {children}
              </article>
            </QueueAnim>
          </main>
        </ArticleLayoutContextProvider>
      )
    },
  ),
)
