import dayjs from 'dayjs'
import { FC, forwardRef, memo } from 'react'
import { QueueAnim } from '../components/Anime'

interface NoteLayoutProps {
  title: string
  tips?: string
  date: Date
}
export const animatingClassName: [string, string] = ['', 'absolute padding-b100']

const NoteLayout: FC<NoteLayoutProps> = memo(
  forwardRef(({ children, date, title, tips }, ref: any) => {
    const dateFormat = dayjs(date).locale('en').format('YYYY-MM-DD ddd')
    return (
      <main className="is-article is-note post-content paul-note" ref={ref}>
        <QueueAnim
          type={['bottom', 'alpha']}
          delay={500}
          forcedReplay
          // leaveReverse
          animatingClassName={animatingClassName}

        >
          <article key={dateFormat}>
            <h1>{dateFormat}</h1>
            <h2 title={tips} style={{ textAlign: 'center' }}>
              {title}
            </h2>

            {children}
          </article>
        </QueueAnim>
      </main>
    )
  }),
)

export { NoteLayout }

