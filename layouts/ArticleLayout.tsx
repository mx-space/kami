import QueueAnim from 'rc-queue-anim'
import Texty from 'rc-texty'
import {
  FC,
  forwardRef,
  DetailedHTMLProps,
  HTMLAttributes,
  memo,
  useEffect,
} from 'react'
import { animatingClassName } from './NoteLayout'
import { isClientSide } from '../utils'
export interface ArticleLayoutProps {
  title?: string
  subtitle?: string | string[]
  subtitleAnimation?: boolean
  delay?: number
  focus?: boolean
}
// @ts-ignore
export const ArticleLayout: FC<
  ArticleLayoutProps &
    DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
> = memo(
  forwardRef(
    (
      {
        children,
        title,
        focus,
        subtitle,
        delay,
        subtitleAnimation = true,

        ...rest
      },
      ref: any,
    ) => {
      useEffect(() => {
        if (focus) {
          document.body.classList.add('focus')
        }
        return () => {
          document.body.classList.remove('focus')
        }
      })
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
                    <>
                      <Texty type={'mask-bottom'} mode={'smooth'} key={title}>
                        {title}
                      </Texty>
                    </>
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
                    {isClientSide() && subtitleAnimation ? (
                      typeof subtitle === 'string' ? (
                        <Texty
                          type={'mask-bottom'}
                          mode={'smooth'}
                          delay={500}
                          key={subtitle}
                        >
                          {subtitle}
                        </Texty>
                      ) : (
                        subtitle.map((str, index) => (
                          <Texty
                            className={'mb-2'}
                            type={'mask-bottom'}
                            mode={'smooth'}
                            delay={500 * index}
                            key={index}
                          >
                            {str}
                          </Texty>
                        ))
                      )
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
            onEnd={(e) => {
              const { target, type } = e
              if (type === 'enter') {
                const $t = target as HTMLDivElement
                $t.style.transform = ''
              }
            }}
            animatingClassName={animatingClassName}
          >
            <article className="post-content kami-note" key={title}>
              {children}
            </article>
          </QueueAnim>
        </main>
      )
    },
  ),
)
