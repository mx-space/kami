import QueueAnim from 'rc-queue-anim'
import Texty from 'rc-texty'
import { FC, forwardRef, DetailedHTMLProps, HTMLAttributes, memo } from 'react'
import { animatingClassName } from './NoteLayout'
import { isClientSide } from '../utils'
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
      <main className="is-article" ref={ref} {...rest} id={'article-wrap'}>
        {title && (
          <section className="post-title">
            <h1>
              <QueueAnim
                type="alpha"
                // animatingClassName={['absolute', 'absolute']}
                leaveReverse
                appear={false}
              >
                {isClientSide() ? (
                  <Texty type={'mask-bottom'} mode={'smooth'} key={title}>
                    {title}
                  </Texty>
                ) : (
                  title
                )}
              </QueueAnim>
            </h1>

            {subtitle && (
              <h2>
                <QueueAnim
                  type={'alpha'}
                  // animatingClassName={['absolute', 'absolute']}
                >
                  {isClientSide() ? (
                    <Texty
                      type={'mask-bottom'}
                      mode={'smooth'}
                      delay={500}
                      key={subtitle}
                    >
                      {subtitle}
                    </Texty>
                  ) : (
                    subtitle
                  )}
                </QueueAnim>
              </h2>
            )}
          </section>
        )}
        <QueueAnim
          delay={delay ?? 300}
          duration={500}
          animConfig={{ opacity: [1, 0], translateY: [0, 50] }}
          animatingClassName={animatingClassName}
        >
          <article className="post-content paul-note" key={title}>
            {children}
          </article>
        </QueueAnim>
      </main>
    )
  }),
)
