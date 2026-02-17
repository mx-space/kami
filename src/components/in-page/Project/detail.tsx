import { sanitizeUrl } from 'markdown-to-jsx'
import type { FC } from 'react'
import { useEffect } from 'react'

import { useProjectCollection } from '~/atoms/collections/project'
import { KamiMarkdown } from '~/components/common/KamiMarkdown'
import { Loading } from '~/components/ui/Loading'
import { SliderImagesPopup } from '~/components/ui/SliderImagesPopup'

import styles from './detail.module.css'
import { ProjectIcon } from './project-icon'

export const ProjectDetail: FC<{ id: string }> = (props) => {
  const { id } = props
  const project = useProjectCollection((state) => state.data.get(id))

  useEffect(() => {
    useProjectCollection.getState().fetchById(id)
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
        <div className="project-detail flex flex-col">
          <h1>{name}</h1>
          <p>{description}</p>
          <p className="space-x-4">
            {previewUrl && (
              <a href={previewUrl} className="btn blue" target="_blank" rel="noreferrer">
                预览站点
              </a>
            )}
            {projectUrl && (
              <a href={projectUrl} className="btn green" target="_blank" rel="noreferrer">
                获取项目
              </a>
            )}
            {docUrl && (
              <a
                href={docUrl}
                className="btn text-shizuku-text bg-transparent"
                target="_blank" rel="noreferrer"
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
        <KamiMarkdown
          value={text}
          codeBlockFully
          renderers={{
            link: {
              react(node, output, state) {
                return (
                  <Link href={sanitizeUrl(node.target)!} key={state?.key}>
                    {output(node.content, state!)}
                  </Link>
                )
              },
            },
          }}
        />
      </article>
    </>
  )
}

const Link: FC<{ href: string }> = (props) => {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer"
      className="border-b-always-yellow-100 border-b border-opacity-20 pb-1"
    >
      {props.children}
    </a>
  )
}
