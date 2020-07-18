import Kico from 'assets/images/Kico.jpg'
import { ImageLazy } from 'components/Image'
import { SliderImagesPopup } from 'components/SliderImagesPopup'
import { ProjectModel } from 'models/project'
import { NextPage } from 'next'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Rest } from 'utils/api'
import { SEO } from '../../components/SEO'

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
          defaultImage={Kico}
          alt={name}
          src={avatar as string}
          style={{ height: '10rem', width: '10em' }}
        />
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
            <a href={props.docUrl} className="btn transparent" target="_blank">
              项目文档
            </a>
          )}
        </p>
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
  const { data } = await Rest('Project').get(id)
  return data
}

export default ProjectView
