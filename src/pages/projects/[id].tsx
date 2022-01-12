import { ProjectModel } from '@mx-space/api-client'
import Kico from 'assets/images/Kico.jpg'
import { ImageLazy } from 'components/universal/Image'
import { SliderImagesPopup } from 'components/universal/SliderImagesPopup'
import { NextPage } from 'next'
import ReactMarkdown from 'react-markdown'
import { apiClient } from 'utils/client'
import { SEO } from '../../components/universal/Seo'

type ProjectViewProps = ProjectModel

const ProjectView: NextPage<ProjectViewProps> = (props) => {
  const { name, avatar, images } = props
  const imageSet = images?.map((image, i) => {
    return {
      src: image,
      alt: name + ' - ' + i,
    }
  })

  return (
    <main>
      <SEO
        {...{
          title: props.name,
          description: props.description,
          openGraph: {
            type: 'website',
          },
        }}
      />
      <section className="project-head">
        <ImageLazy
          defaultImage={Kico.src}
          alt={name}
          src={avatar as string}
          style={{
            height: '10rem',
            width: '10em',
            float: 'left',
            marginRight: '3rem',
          }}
        />
        <div
          style={{ display: 'flex', flexDirection: 'column', float: 'left' }}
        >
          <h1>{name}</h1>
          <p>{props.description}</p>
          <p>
            {props.previewUrl && (
              <a href={props.previewUrl} className="btn blue" target="_blank">
                预览站点
              </a>
            )}
            {props.projectUrl && (
              <a
                href={props.projectUrl}
                className="btn transparent"
                target="_blank"
              >
                获取项目
              </a>
            )}
            {props.docUrl && (
              <a
                href={props.docUrl}
                className="btn transparent"
                target="_blank"
              >
                项目文档
              </a>
            )}
          </p>
        </div>
      </section>
      {!!imageSet && (
        <>
          <section className="project-screenshot">
            <SliderImagesPopup images={imageSet} />
          </section>
        </>
      )}

      <article>
        <ReactMarkdown source={props.text} />
      </article>
    </main>
  )
}

ProjectView.getInitialProps = async (ctx) => {
  const { query } = ctx
  const id = query.id as string
  const data = await apiClient.project.getById(id)
  return data
}

export default ProjectView
