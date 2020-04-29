import { FC } from 'react'
import Texty from 'rc-texty'
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
      <article className="post-content paul-note">{children}</article>
    </main>
  )
}
