import QueueAnim from 'rc-queue-anim'
import Texty from 'rc-texty'
import { FC, forwardRef } from 'react'
export interface ArticleLayoutProps {
  title?: string
  subtitle?: string
}

export const ArticleLayout: FC<ArticleLayoutProps> = forwardRef(
  ({ children, title, subtitle }, ref: any) => {
    return (
      <main className="is-article" ref={ref}>
        {title && (
          <section className="post-title">
            <h1>
              <Texty type={'bottom'} mode={'smooth'}>
                {title}
              </Texty>
            </h1>

            {subtitle && (
              <h2>
                <Texty type={'bottom'} mode={'smooth'} delay={500}>
                  {subtitle}
                </Texty>
              </h2>
            )}
          </section>
        )}
        <QueueAnim
          delay={500}
          duration={500}
          animConfig={{ opacity: [1, 0], translateY: [0, 50] }}
        >
          <article className="post-content paul-note" key={'a'}>
            {children}
          </article>
        </QueueAnim>
      </main>
    )
  },
)
