import { FC, Component } from 'react'

export interface ArticleLayoutProps {
  title: string
  subtitle?: string
  comments?: FC | Component
}

export const ArticleLayout: FC<ArticleLayoutProps> = ({
  children,
  title,
  subtitle,
  comments,
}) => {
  return (
    <main className="is-article">
      <section className="post-title">
        <h1>{title}</h1>
        {subtitle && <h2>{subtitle}</h2>}
      </section>
      <article className="post-content">{children}</article>

      {comments && <div className="comments">{comments}</div>}
    </main>
  )
}
