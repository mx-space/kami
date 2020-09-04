import { NextPage } from 'next'
import { QueueAnim } from '../../components/Anime'
import { ApplyForLink } from '../../components/ApplyLink'
import { SEO } from '../../components/SEO'
import { ArticleLayout } from '../../layouts/ArticleLayout'
import { LinkModel, LinkType } from '../../models/link'
import { Rest } from '../../utils/api'
const renderSection = (data: LinkModel[]) => {
  return (
    <div className="note-item">
      <ul>
        <QueueAnim delay={700}>
          <div className="" key={data.length}>
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
          </div>
        </QueueAnim>
      </ul>
    </div>
  )
}

const renderTitle = (text: string, delay: number) => {
  return (
    <QueueAnim delay={delay} type="right">
      <strong key={delay} style={{ fontSize: '1.5rem' }}>
        {text}
      </strong>
    </QueueAnim>
  )
}
const FriendsView: NextPage<{ data: LinkModel[] }> = (props) => {
  const friends: LinkModel[] = []
  const collections: LinkModel[] = []

  for (const link of props.data) {
    if (link.hide) {
      continue
    }
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
            {friends.length !== 0 && renderTitle('个人收藏', 850)}
            {renderSection(collections)}
          </>
        )}
      </article>
      <QueueAnim delay={1000}>
        <ApplyForLink key={'link'} />
      </QueueAnim>
    </ArticleLayout>
  )
}

FriendsView.getInitialProps = async () => {
  const { data } = (await Rest('Link').get('all')) as any

  return { data } as { data: LinkModel[] }
}
export default FriendsView
