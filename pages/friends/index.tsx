import { NextPage } from 'next'
import { Rest } from '../../utils/api'
import { LinkModel, LinkType } from '../../models/link'
import { ArticleLayout } from '../../layouts/ArticleLayout'
import { QueueAnim } from '../../components/Anime'
import { SEO } from '../../components/SEO'

const FriendsView: NextPage<{ data: LinkModel[] }> = (props) => {
  const friends: LinkModel[] = []
  const collections: LinkModel[] = []

  for (const link of props.data) {
    switch (link.type) {
      case LinkType.Friend: {
        friends.push(link)
        break
      }
      case LinkType.Collection: {
        collections.push(link)
      }
    }
  }

  const renderSection = (data: LinkModel[]) => {
    return (
      <div className="note-item">
        <ul>
          <QueueAnim delay={700}>
            {data.map((link) => {
              return (
                <li key={link._id}>
                  <a href={link.url} target={'_blank'}>
                    {link.name}
                  </a>
                  <span className="meta">{link.description || ''}</span>
                </li>
              )
            })}
          </QueueAnim>
        </ul>
      </div>
    )
  }

  const renderTitle = (text: string, delay: number) => {
    return (
      <QueueAnim delay={delay} type="right">
        <h1 key={delay}>{text}</h1>
      </QueueAnim>
    )
  }

  return (
    <ArticleLayout title={'朋友们'} subtitle={'海内存知己, 天涯若比邻'}>
      <SEO title={'朋友们'} />
      <article className="post-content paul-note article-list">
        {friends.length > 0 && (
          <>
            {collections.length !== 0 && renderTitle('互相关注', 650)}
            {renderSection(friends)}
          </>
        )}
        {collections.length > 0 && (
          <>
            {friends.length !== 0 && renderTitle('个人收藏', 650)}
            {renderSection(collections)}
          </>
        )}
      </article>
    </ArticleLayout>
  )
}

FriendsView.getInitialProps = async () => {
  const { data } = await Rest('Link').get('all')

  return { data } as { data: LinkModel[] }
}
export default FriendsView
