import { memo } from 'react'

import { useAppStore } from '~/atoms/app'
import { useIsLogged } from '~/atoms/user'
import { TextUpTransitionView } from '~/components/ui/Transition/TextUpTransitionView'
import { resolveUrl } from '~/utils/utils'

import { useArticleLayoutProps } from './hooks'
import styles from './index.module.css'

export const ArticleLayoutTitle = memo<{ animate?: boolean }>(
  ({ animate = true }) => {
    const {
      title,
      type,
      id,
      subtitle,
      subtitleAnimation = true,
    } = useArticleLayoutProps()
    const isLogged = useIsLogged()
    const url = useAppStore((state) => state.appUrl)

    if (!title) {
      return null
    }
    return (
      <section className={styles['post-title']}>
        <h1 className={styles['h1']}>
          <TextUpTransitionView appear={animate} key={title}>
            {title}
          </TextUpTransitionView>

          {type && id && isLogged && url ? (
            <a
              data-hide-print
              className="edit-link float-right"
              target="_blank"
              href={
                resolveUrl(
                  `#/${type === 'page' ? 'pages' : 'posts'}/edit?id=${id}`,
                  url.adminUrl,
                )!
              } rel="noreferrer"
            >
              编辑
            </a>
          ) : null}
        </h1>

        {subtitle && (
          <h2>
            {subtitleAnimation ? (
              typeof subtitle === 'string' ? (
                <TextUpTransitionView appear={animate} key={subtitle}>
                  {subtitle}
                </TextUpTransitionView>
              ) : (
                subtitle.map((str, index) => (
                  <TextUpTransitionView
                    appear={animate}
                    className="mb-2"
                    initialDelay={index}
                    key={subtitle[index]}
                  >
                    {str}
                  </TextUpTransitionView>
                ))
              )
            ) : (
              subtitle
            )}
          </h2>
        )}
      </section>
    )
  },
)
