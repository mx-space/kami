import { faBookOpen, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SectionNews, { SectionNewsProps } from 'components/SectionNews'
import { omit } from 'lodash'
import { observer } from 'mobx-react'
import { RandomImage, Top } from 'models/aggregate'
import { NextPage } from 'next'
import { useState } from 'react'
import { useStore } from 'store'
import { Rest } from 'utils/api'

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

  const { posts, notes, says, projects, randomImages } = props
  const images = [...randomImages]
  const [sections, _] = useState({
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

  return (
    <main>
      <style jsx>{`
        .avatar {
          width: 100%;
        }
      `}</style>
      <section className="paul-intro">
        <div className="intro-avatar ">
          <img src={avatar} alt={name} className="avatar" />
        </div>
        <div className="intro-info">
          <h1>{name}</h1>
          <p>{introduce || description || 'Hello World~'}</p>
          <div className="social-icons">
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
        </div>
      </section>
      <section className="paul-news">
        <SectionNews {...sections.postSection} />
        <SectionNews {...sections.noteSection} />
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
        as: `posts/${category.slug}/${slug}`,
        href: `posts/[category]/[slug]`,
      }
    }
    case 'Note': {
      const { nid } = obj
      return {
        as: `notes/${nid}`,
        href: `notes/[id]`,
      }
    }
    case 'Say': {
      return { as: `says`, href: `says` }
    }
    case 'Project': {
      const { _id } = obj
      return { as: `projects/${_id}`, href: `projects/[id]` }
    }
  }
}

IndexView.getInitialProps = async (): Promise<IndexViewProps> => {
  const aggregateData = (await Rest('Aggregate').get('top')) as Top.Aggregate
  const randomImageData = (await Rest('Aggregate').get(
    'random?type=3&imageType=2&size=8',
  )) as { data: RandomImage.Image[] }
  return {
    ...(omit(aggregateData, ['ok', 'timestamp']) as IndexViewProps),
    randomImages: randomImageData.data.map((image) => {
      return image.locate !== RandomImage.Locate.Online
        ? `${process.env.APIURL}/uploads/background/${image.name}`
        : `` // TODO online images
    }),
  }
}

export default observer(IndexView)
