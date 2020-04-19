import { FC, Component } from 'react'

interface NoteLayoutProps {
  meta?: string | FC | React.ReactNode | Component
  title: string
  tips?: string
}

const NoteLayout: FC<NoteLayoutProps> = ({ children, meta, title, tips }) => {
  return (
    <main className="is-article is-note post-content paul-note">
      <style jsx global>{`
        .is-note #write {
          font-family: 'Noto Serif SC', 'PingFang SC', 'Hiragino Sans GB',
            'Heiti SC', 'Microsoft YaHei', 'WenQuanYi Micro Hei';
        }
        .is-note .note-head {
          width: 100%;
          text-align: center;
        }
        .is-note .note-head h1 {
          font-size: 32px;
        }
        .is-note .note-meta {
          margin: 1rem;
          text-align: center;
          line-height: 16px;
          font-size: 16px;
          opacity: 0.8;
          font-family: unset;
        }
        .is-note .note-meta > div {
          display: inline-block;
        }
        .is-note .note-meta span {
          margin: 0 6px;
          display: inline-block;
        }

        .is-note #write {
          color: var(--shizuku-text-color);
          font-size: 16px;
          line-height: 1.75;
          word-wrap: break-word;
          text-align: justify;
          padding-top: 2rem;
        }
        .is-note #write > p:first-child::first-letter {
          float: left;
          font-size: 2.4em;
          margin: 0 0.2em 0 0;
        }

        .is-note #write > p {
          clear: both;
        }
        .is-note #write > p:not(:first-child)::first-letter {
          margin-left: 2rem;
        }
      `}</style>

      <div className="note-head">
        <h1>{title}</h1>
        <div className="note-meta" title={tips}>
          {meta}
        </div>
        <article>{children}</article>
      </div>
    </main>
  )
}

export { NoteLayout }
