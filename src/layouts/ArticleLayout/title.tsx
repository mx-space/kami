import { userStore } from 'common/store'
import RcQueueAnim from 'rc-queue-anim'
import TextyAnim from 'rc-texty'
import { isClientSide, observer, resolveUrl } from 'utils'
import { useArticleLayoutProps } from './hooks'

export const ArticleLayoutTitle = observer((props) => {
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
    <section className="post-title">
      <h1>
        <RcQueueAnim
          type="alpha"
          // animatingClassName={['absolute', 'absolute']}
          leaveReverse
          appear={false}
        >
          {isClientSide() ? (
            <>
              <TextyAnim type={'mask-bottom'} mode={'smooth'} key={title}>
                {title}
              </TextyAnim>
            </>
          ) : (
            title
          )}
        </RcQueueAnim>
        {type && id && isLogged && url ? (
          <a
            className="edit-link"
            style={{ float: 'right' }}
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
          <RcQueueAnim
            type={'alpha'}
            // animatingClassName={['absolute', 'absolute']}
          >
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
                    key={index}
                  >
                    {str}
                  </TextyAnim>
                ))
              )
            ) : (
              subtitle
            )}
          </RcQueueAnim>
        </h2>
      )}
    </section>
  )
})
