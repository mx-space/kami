import { FC } from 'react'
import Texty from 'rc-texty'
import QueueAnim from 'rc-queue-anim'
export interface ArticleLayoutProps {
  title?: string
  subtitle?: string
}

export const ArticleLayout: FC<ArticleLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <main className="is-article">
      {title && (
        <section className="post-title">
          <h1>
            <Texty type={'bottom'} mode={'smooth'}>
              {title}
            </Texty>
          </h1>

          {subtitle && <h2>{subtitle}</h2>}
        </section>
      )}
      <QueueAnim
        delay={500}
        duration={500}
        animConfig={[
          { opacity: [1, 0], translateY: [0, 50] },
          { opacity: [1, 0], translateY: [0, -50] },
        ]}
      >
        <article className="post-content paul-note" key={'a'}>
          {children}
        </article>
      </QueueAnim>
    </main>
  )
}
