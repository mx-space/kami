import { useRedirectSimpleRender } from 'common/hooks/useRedirectSimpleRender'
import { userStore } from 'common/store'
import QueueAnim from 'rc-queue-anim'
import Texty from 'rc-texty'
import {
  DetailedHTMLProps,
  FC,
  forwardRef,
  HTMLAttributes,
  useEffect,
} from 'react'
import { observer } from 'utils/mobx'
import { isClientSide, resolveUrl } from '../utils'
import { animatingClassName } from './NoteLayout'
export interface ArticleLayoutProps {
  title?: string
  subtitle?: string | string[]
  subtitleAnimation?: boolean
  delay?: number
  focus?: boolean
  type?: 'post' | 'page'
  id?: string
}
// @ts-ignore
export const ArticleLayout: FC<
  ArticleLayoutProps &
    DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
> = observer(
  forwardRef(
    (
      {
        children,
        title,
        focus,
        subtitle,
        delay,
        subtitleAnimation = true,
        type,
        id,
        ...rest
      },
      ref: any,
    ) => {
      useRedirectSimpleRender(id)
      useEffect(() => {
        if (focus) {
          document.body.classList.add('focus')
        }
        return () => {
          document.body.classList.remove('focus')
        }
      }, [focus])
      const { isLogged, url } = userStore
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
                {type && id && isLogged && url ? (
                  <a
                    className="edit-link"
                    style={{ float: 'right' }}
                    target="_blank"
                    href={
                      resolveUrl(
                        `/#/${
                          type === 'page' ? 'extra/page' : 'posts'
                        }/edit?id=${id}`,
                        url.adminUrl,
                      )!
                    }
                  >
                    编辑
                  </a>
                ) : null}
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
