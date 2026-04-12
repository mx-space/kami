import { Link } from '~/i18n/navigation'
import type { FC } from 'react'

import styles from './list.module.css'
import { ProjectIcon } from './project-icon'

export type Project = {
  id: string
  avatar?: string
  name: string
  description?: string
}
export const ProjectList: FC<{ projects: Project[] }> = (props) => {
  const projects = props.projects

  return (
    <section className={styles['root']} key="list">
      <div className="<sm:grid-cols-1 <md:grid-cols-2 grid grid-cols-3 gap-12 xl:grid-cols-4">
        {projects.map((project) => {
          return (
            <Link
              href={`projects/${project.id}`}
              key={project.id}
              className="grid grid-cols-[1fr_2fr] gap-4"
            >
              <ProjectIcon avatar={project.avatar} name={project.name} />
              <span className="flex shrink-0 grow flex-col gap-2 text-left">
                <h4 className="font-2xl m-0 p-0 font-medium">{project.name}</h4>
                <span className="<sm:line-clamp-5 <md:line-clamp-4 line-clamp-2 text-sm">
                  {project.description}
                </span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
