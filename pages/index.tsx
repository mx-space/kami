import { omit } from 'lodash'
import { Top } from 'models/aggregate'
import { NextPage } from 'next'
import { Rest } from 'utils/api'
import { observer } from 'mobx-react'
import { useStore } from 'store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SectionNews, { SectionNewsProps } from 'components/SectionNews'
import { faBookOpen } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

interface IndexViewProps {
  posts: Top.Post[]
  notes: Top.Note[]
  says: Top.Say[]
  projects: Top.Project[]
}

const IndexView: NextPage<IndexViewProps> = (props) => {
  const { userStore, appStore, socialStore } = useStore()
  const { name, introduce, master } = userStore
  const { avatar } = master
  const { description } = appStore
  const { socialLinks } = socialStore

  const { posts, notes, says, projects } = props

  const [sections, _] = useState({
    postSection: {
      title: '最新博文',
      icon: faBookOpen,
      moreUrl: 'posts',
      content: posts.slice(0, 4).map((p) => {
        return {
          title: p.title,
          background: '',
          _id: p._id,
          ...buildRoute('Post', p),
        }
      }),
      // content: [],
    } as SectionNewsProps,
  })
  // const PostSection: SectionNewsProps =

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
                  key={item.title}
                >
                  <FontAwesomeIcon icon={item.icon} />
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <SectionNews {...sections.postSection} />
    </main>
  )
}
enum ContentType {
  Note,
  Post,
  Say,
  Project,
}

function buildRoute<T extends { _id: string } & { nid?: string }>(
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

IndexView.getInitialProps = async () => {
  const resp = (await Rest('Aggregate').get('top')) as Top.Aggregate

  return omit(resp, ['ok', 'timestamp']) as IndexViewProps
}

export default observer(IndexView)
