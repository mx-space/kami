import { Component, FC, forwardRef } from 'react'
import { QueueAnim } from '../components/Anime'

interface NoteLayoutProps {
  meta?: string | FC | React.ReactNode | Component
  title: string
  tips?: string
}

const NoteLayout: FC<NoteLayoutProps> = forwardRef(
  ({ children, meta, title, tips }, ref) => {
    return (
      <main className="is-article is-note post-content paul-note">
        <QueueAnim type="bottom">
          <div className="note-head" key="a">
            <h1>{title}</h1>
            <div className="note-meta" title={tips}>
              {meta}
            </div>
            <article>{children}</article>
          </div>
        </QueueAnim>
      </main>
    )
  },
)

export { NoteLayout }
