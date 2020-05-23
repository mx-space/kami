import Kico from 'assets/images/Kico.jpg'
import { Image } from 'components/Image'
import { SliderImagesPopup } from 'components/SliderImagesPopup'
import { ProjectModel } from 'models/dto/project'
import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useStore } from 'store'
import { Rest } from 'utils/api'
import configs from '../../configs'

type ProjectViewProps = ProjectModel

const ProjectView: NextPage<ProjectViewProps> = (props) => {
  const { name, avatar, images } = props
  const [photoIndex, setIndex] = useState(0)
  const [isOpen, setOpen] = useState(false)
  const { appStore } = useStore()

  return (
    <main>
      <NextSeo
        {...{
          title: props.name + ' - ' + (configs.title || appStore.title),
          description: props.description,
        }}
      />
      <section className="project-head">
        <Image
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
      {!!images?.length && (
        <>
          <section className="project-screenshot">
            {images.map((image, i) => {
              return (
                <img
                  src={image}
                  key={i}
                  onClick={() => {
                    setIndex(i)
                    setOpen(true)
                  }}
                  style={{ cursor: 'pointer' }}
                />
              )
            })}
          </section>
          <SliderImagesPopup
            images={images}
            onCloseRequest={() => setOpen(false)}
            isOpen={isOpen}
            photoIndex={photoIndex}
            onMovePrevRequest={() =>
              setIndex((photoIndex + images.length - 1) % images.length)
            }
            onMoveNextRequest={() => setIndex((photoIndex + 1) % images.length)}
          />
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
