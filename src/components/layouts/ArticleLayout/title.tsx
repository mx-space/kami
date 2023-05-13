import { memo } from 'react'

import { useAppStore } from '~/atoms/app'
import { useIsLogged } from '~/atoms/user'
import { TextFade } from '~/components/ui/Animate/text-anim'
import { useIsClient } from '~/hooks/common/use-is-client'
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
    const isClientSide = useIsClient()
    if (!title) {
      return null
    }
    return (
      <section className={styles['post-title']}>
        <h1 className={styles['h1']} suppressHydrationWarning>
          {isClientSide ? (
            <TextFade appear={animate} key={title}>
              {title}
            </TextFade>
          ) : (
            title
          )}

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
              }
            >
              编辑
            </a>
          ) : null}
        </h1>

        {subtitle && (
          <h2 suppressHydrationWarning>
            {isClientSide && subtitleAnimation ? (
              typeof subtitle === 'string' ? (
                <TextFade appear={animate} key={subtitle}>
                  {subtitle}
                </TextFade>
              ) : (
                subtitle.map((str, index) => (
                  <TextFade
                    appear={animate}
                    className="mb-2"
                    delay={index}
                    key={subtitle[index]}
                  >
                    {str}
                  </TextFade>
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
