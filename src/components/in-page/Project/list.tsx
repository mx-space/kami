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
      <div className="grid grid-cols-3 <sm:grid-cols-1 <md:grid-cols-2 gap-12 xl:grid-cols-4">
        {projects.map((project) => {
          return (
            <Link
              href={`projects/${project.id}`}
              key={project.id}
              className="grid grid-cols-[1fr_2fr] gap-4"
            >
              <ProjectIcon avatar={project.avatar} name={project.name} />
              <span className="flex flex-shrink-0 flex-grow flex-col text-left gap-2">
                <h4 className="font-2xl font-medium m-0 p-0">{project.name}</h4>
                <span className="line-clamp-2 text-sm <sm:line-clamp-5 <md:line-clamp-4">
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
