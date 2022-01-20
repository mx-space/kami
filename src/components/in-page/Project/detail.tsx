import { Loading } from 'components/universal/Loading'
import { SliderImagesPopup } from 'components/universal/SliderImagesPopup'
import { FC, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { useStore } from 'store'
import styles from './detail.module.css'
import { ProjectIcon } from './icon'

export const ProjectDetail: FC<{ id: string }> = (props) => {
  const { id } = props
  const { projectStore } = useStore()
  const project = projectStore.get(id)
  useEffect(() => {
    projectStore.fetchById(id)
  }, [id])
  if (!project) {
    return <Loading />
  }

  const { name, description, previewUrl, projectUrl, docUrl, images, text } =
    project
  const imageSet = images?.map((image, i) => {
    return {
      src: image,
      alt: name + ' - ' + i,
    }
  })
  return (
    <>
      <section className={styles['head']}>
        <ProjectIcon avatar={project.avatar} alt={project.name} />
        <div className="flex flex-col project-detail">
          <h1>{name}</h1>
          <p>{description}</p>
          <p>
            {previewUrl && (
              <a href={previewUrl} className="btn blue" target="_blank">
                预览站点
              </a>
            )}
            {projectUrl && (
              <a href={projectUrl} className="btn transparent" target="_blank">
                获取项目
              </a>
            )}
            {docUrl && (
              <a href={docUrl} className="btn transparent" target="_blank">
                项目文档
              </a>
            )}
          </p>
        </div>
      </section>
      {!!imageSet && (
        <section className={styles['screenshot']}>
          <SliderImagesPopup images={imageSet} />
        </section>
      )}

      <article>
        <ReactMarkdown source={text} />
      </article>
    </>
  )
}
