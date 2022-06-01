import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import { isClientSide, resolveUrl } from 'utils'

import { TextFade } from '~/components/universal/Animate/text-anim'
import { useStore } from '~/store'

import { useArticleLayoutProps } from './hooks'
import styles from './index.module.css'

export const ArticleLayoutTitle: FC<{ animate?: boolean }> = observer(
  ({ animate = true }) => {
    const { userStore } = useStore()
    const {
      title,
      type,
      id,
      subtitle,
      subtitleAnimation = true,
    } = useArticleLayoutProps()
    const { isLogged, url } = userStore
    if (!title) {
      return null
    }
    return (
      <section className={styles['post-title']}>
        <h1 className={styles['h1']} suppressHydrationWarning>
          {isClientSide() ? (
            <TextFade appear={animate} key={title}>
              {title}
            </TextFade>
          ) : (
            title
          )}

          {type && id && isLogged && url ? (
            <a
              className="edit-link float-right text-green"
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
            {isClientSide() && subtitleAnimation ? (
              typeof subtitle === 'string' ? (
                <TextFade appear={animate} key={subtitle}>
                  {subtitle}
                </TextFade>
              ) : (
                subtitle.map((str, index) => (
                  <TextFade
                    appear={animate}
                    className={'mb-2'}
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
