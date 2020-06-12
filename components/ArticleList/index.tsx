import { FC, memo } from 'react'

type ArticleListProps = {
  title: string
  subtitle?: string
}

export const ArticleList: FC<ArticleListProps> = memo((props) => {
  const { title, subtitle } = props
  return (
    <main>
      <style jsx>
        {`
          h1 {
            margin: 10px 0 15px;
            font-size: 1.5rem;
            font-family: Helvetica;
          }
          ul {
            padding-left: 0.5em;
            list-style: circle;
            margin: 10px 0;
            line-height: 30px;
          }

          a {
            text-decoration: none;
            color: var(--shizuku-text-color);
            border-bottom: 1px solid rgba(0, 0, 0, 0);
            margin-right: 1em;
            transition: border 0.15s ease-out;
          }
          a:hover {
            border-color: var(--shizuku-text-color);
          }
          .date {
            margin-right: 0.5em;
          }
        `}
      </style>
      <section className={'post-title'}>
        <h1>{title}</h1>

        {subtitle && <h2>{subtitle}</h2>}
      </section>
      {props.children}
    </main>
  )
})
