import QueueAnim from 'rc-queue-anim'
import Texty from 'rc-texty'
import { FC, forwardRef, DetailedHTMLProps, HTMLAttributes, memo } from 'react'
export interface ArticleLayoutProps {
  title?: string
  subtitle?: string

  delay?: number
}
// @ts-ignore
export const ArticleLayout: FC<
  ArticleLayoutProps &
    DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
> = memo(
  forwardRef(({ children, title, subtitle, delay, ...rest }, ref: any) => {
    return (
      <main className="is-article" ref={ref} {...rest}>
        {title && (
          <section className="post-title">
            <h1>
              <Texty type={'mask-bottom'} mode={'smooth'}>
                {title}
              </Texty>
            </h1>

            {subtitle && (
              <h2>
                <Texty type={'mask-bottom'} mode={'smooth'} delay={500}>
                  {subtitle}
                </Texty>
              </h2>
            )}
          </section>
        )}
        <QueueAnim
          delay={delay ?? (title && subtitle ? 1200 : title ? 700 : 300)}
          duration={500}
          animConfig={{ opacity: [1, 0], translateY: [0, 50] }}
        >
          <article className="post-content paul-note" key={'a'}>
            {children}
          </article>
        </QueueAnim>
      </main>
    )
  }),
)
