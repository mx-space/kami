import type { FC } from 'react'
import { useEffect } from 'react'

import { Loading } from '~/components/universal/Loading'
import { Markdown } from '~/components/universal/Markdown'
import { SliderImagesPopup } from '~/components/universal/SliderImagesPopup'
import { useStore } from '~/store'

import styles from './detail.module.css'
import { ProjectIcon } from './project-icon'

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
      alt: `${name} - ${i}`,
    }
  })
  return (
    <>
      <section className={styles['head']}>
        <ProjectIcon avatar={project.avatar} name={project.name} />
        <div className="flex flex-col project-detail">
          <h1>{name}</h1>
          <p>{description}</p>
          <p className="space-x-4">
            {previewUrl && (
              <a href={previewUrl} className="btn blue" target="_blank">
                预览站点
              </a>
            )}
            {projectUrl && (
              <a href={projectUrl} className="btn green" target="_blank">
                获取项目
              </a>
            )}
            {docUrl && (
              <a
                href={docUrl}
                className="btn bg-transparent text-shizuku-text"
                target="_blank"
              >
                项目文档
              </a>
            )}
          </p>
        </div>
      </section>
      {imageSet?.length && imageSet.length > 0 ? (
        <section className={styles['screenshot']}>
          <SliderImagesPopup images={imageSet} />
        </section>
      ) : null}

      <article className="mt-12">
        <Markdown
          value={text}
          escapeHtml={false}
          codeBlockFully
          renderers={{
            link: Link,
          }}
        />
      </article>
    </>
  )
}

const Link = (props) => {
  return (
    <a href={props.href} target={'_blank'} rel="noreferrer">
      {props.children}
    </a>
  )
}
