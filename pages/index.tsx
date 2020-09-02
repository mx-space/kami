import {
  faBookOpen,
  faHeart,
  faPencilAlt,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { message } from 'antd'
import { useInitialData } from 'common/context/InitialDataContext'
import { useStore } from 'common/store'
import SectionNews, {
  SectionCard,
  SectionNewsProps,
} from 'components/SectionNews'
import omit from 'lodash/omit'
import shuffle from 'lodash/shuffle'
import { Top } from 'models/aggregate'
import { NextPage } from 'next'
import Router from 'next/router'
import QueueAnim from 'rc-queue-anim'
import Texty from 'rc-texty'
import { useEffect, useRef, useState } from 'react'
import { Rest } from 'utils/api'
import { observer } from 'utils/mobx'
import { FriendsSection } from '../components/SectionNews/friend'
import { SectionWrap } from '../components/SectionNews/section'
import configs from '../configs'
import { getAnimationImages as getAnimeImages } from '../utils'
import { stopEventDefault } from '../utils/dom'
import service from '../utils/request'

interface IndexViewProps {
  posts: Top.Post[]
  notes: Top.Note[]
  says: Top.Say[]
  projects: Top.Project[]
  randomImages: string[]
}

const IndexView: NextPage<IndexViewProps> = (props) => {
  const { userStore, appStore, socialStore } = useStore()
  const { name, introduce, master } = userStore
  const { avatar } = master
  const { description } = appStore
  const { socialLinks } = socialStore

  const { posts, notes, randomImages } = props
  const images = [...randomImages]
  const sections = useRef({
    postSection: {
      title: '最新博文',
      icon: faBookOpen,
      moreUrl: 'posts',
      content: posts.slice(0, 4).map((p) => {
        return {
          title: p.title,
          background: images.pop(),
          _id: p._id,
          ...buildRoute('Post', p),
        }
      }),
    } as SectionNewsProps,
    noteSection: {
      title: '随便写写',
      icon: faPencilAlt,
      moreUrl: 'notes',
      content: notes.slice(0, 4).map((n) => {
        return {
          title: n.title,
          background: images.pop(),
          _id: n._id,
          ...buildRoute('Note', n),
        }
      }),
    } as SectionNewsProps,
  })

  const [like, setLike] = useState(0)
  useEffect(() => {
    service.get('like_this').then((number) => {
      setLike(~~number)
    })
  }, [])
  const { user } = useInitialData()
  return (
    <main>
      <section className="paul-intro">
        <div className="intro-avatar ">
          <img
            src={user.avatar || avatar}
            alt={name}
            style={{ width: '100%' }}
          />
        </div>
        <div className="intro-info">
          <h1>
            <Texty type={'mask-bottom'} mode={'smooth'}>
              {name}
            </Texty>
          </h1>
          <p>
            <Texty type={'mask-bottom'} mode={'smooth'} delay={500}>
              {introduce || description}
            </Texty>
          </p>

          <QueueAnim
            delay={500}
            duration={500}
            animConfig={{ opacity: [1, 0], translateY: [0, 50] }}
          >
            <div className="social-icons" key={'a'}>
              {socialLinks.map((item) => {
                return (
                  <a
                    href={item.url}
                    target="_blank"
                    ks-text={item.title}
                    ks-tag="bottom"
                    key={item.title}
                    style={item.color ? { color: item.color } : {}}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                  </a>
                )
              })}
            </div>
          </QueueAnim>
        </div>
      </section>
      <section className="paul-news" style={{ minHeight: '34rem' }}>
        <QueueAnim
          className="demo-content"
          delay={1200}
          duration={500}
          animConfig={[
            { opacity: [1, 0], translateY: [0, 50] },
            { opacity: [1, 0], translateY: [0, -50] },
          ]}
        >
          {[
            <SectionNews {...sections.current.postSection} key={1} />,
            <SectionNews {...sections.current.noteSection} key={2} />,
            <SectionWrap
              {...{
                title: '朋友们',
                moreUrl: 'friends',
                icon: faUsers,
              }}
              key={3}
            >
              <FriendsSection />
            </SectionWrap>,
            <SectionWrap
              {...{
                title: '了解更多',
                icon: faHeart,
                showMoreIcon: false,
              }}
              key={4}
            >
              <SectionCard
                {...{
                  title: '留言',
                  desc: '你的话对我很重要',
                  src: images.pop() as string,
                  href: '/message',
                  onClick: (e) => {
                    stopEventDefault(e)
                    Router.push('/[page]', '/message')
                  },
                }}
              />
              <SectionCard
                {...{
                  title: '关于',
                  desc: '这里有我的小秘密',
                  src: images.pop() as string,
                  href: '/about',
                  onClick: (e) => {
                    stopEventDefault(e)
                    Router.push('/[page]', '/about')
                  },
                }}
              />
              <SectionCard
                {...{
                  title: `点赞 (${like})`,
                  desc: '如果你喜欢的话点个赞呗',
                  src: images.pop() as string,
                  href: '/like_this',
                  onClick: (e) => {
                    stopEventDefault(e)
                    service
                      .post('like_this', null, { withCredentials: true })
                      .then(() => {
                        message.success('感谢喜欢 ❤️')
                        setLike(like + 1)
                      })
                  },
                }}
              />
              <SectionCard
                {...{
                  title: '订阅',
                  desc: '关注订阅不亏哦',
                  src: images.pop() as string,
                  href: '/feed',
                }}
              />
            </SectionWrap>,
          ]}
        </QueueAnim>
      </section>
    </main>
  )
}
enum ContentType {
  Note,
  Post,
  Say,
  Project,
}

function buildRoute<T extends { _id: string } & { nid?: number }>(
  type: keyof typeof ContentType,
  obj: T,
): { as: string; href: string } {
  switch (type) {
    case 'Post': {
      const { slug, category } = obj as any
      return {
        as: `/posts/${category.slug}/${slug}`,
        href: `/posts/[category]/[slug]`,
      }
    }
    case 'Note': {
      const { nid } = obj
      return {
        as: `/notes/${nid}`,
        href: `/notes/[id]`,
      }
    }
    case 'Say': {
      return { as: `/says`, href: `/says` }
    }
    case 'Project': {
      const { _id } = obj
      return { as: `/projects/${_id}`, href: `/projects/[id]` }
    }
  }
}

IndexView.getInitialProps = async (): Promise<IndexViewProps> => {
  const aggregateData = (await Rest('Aggregate').get('top')) as Top.Aggregate
  // const randomImageData = (await Rest('Aggregate').get(
  //   'random?type=3&imageType=2&size=8',
  // )) as { data: RandomImage.Image[] }
  const extraImages = getAnimeImages()

  // const randomImages = randomImageData.data.map((image) => {
  //   return image.locate !== RandomImage.Locate.Online
  //     ? `${process.env.APIURL}/uploads/background/${image.name}`
  //     : (image.url as string)
  // })

  return {
    ...(omit(aggregateData, ['ok', 'timestamp']) as IndexViewProps),
    randomImages: shuffle([/* ...randomImages, */ ...extraImages]),
  }
}

export default observer(IndexView)
