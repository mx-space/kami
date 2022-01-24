import { observer } from 'mobx-react-lite'
import TextyAnim from 'rc-texty'
import { useStore } from 'store'
import { isClientSide, resolveUrl } from 'utils'
import { useArticleLayoutProps } from './hooks'
import styles from './index.module.css'

export const ArticleLayoutTitle = observer(() => {
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
      <h1 className={styles['h1']}>
        {isClientSide() ? (
          <TextyAnim type={'mask-bottom'} mode={'smooth'} key={title}>
            {title}
          </TextyAnim>
        ) : (
          title
        )}

        {type && id && isLogged && url ? (
          <a
            className="edit-link float-right text-green"
            target="_blank"
            href={
              resolveUrl(
                `/#/${type === 'page' ? 'extra/page' : 'posts'}/edit?id=${id}`,
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
          {isClientSide() && subtitleAnimation ? (
            typeof subtitle === 'string' ? (
              <TextyAnim
                type={'mask-bottom'}
                mode={'smooth'}
                delay={500}
                key={subtitle}
              >
                {subtitle}
              </TextyAnim>
            ) : (
              subtitle.map((str, index) => (
                <TextyAnim
                  className={'mb-2'}
                  type={'mask-bottom'}
                  mode={'smooth'}
                  delay={500 * index}
                  key={subtitle[index]}
                >
                  {str}
                </TextyAnim>
              ))
            )
          ) : (
            subtitle
          )}
        </h2>
      )}
    </section>
  )
})
