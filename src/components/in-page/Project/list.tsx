import { ProjectModel } from '@mx-space/api-client'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { apiClient } from 'utils'
import { ProjectIcon } from './icon'
import styles from './list.module.css'

export const ProjectList: FC = () => {
  const [projects, setProjects] = useState<ProjectModel[]>([])
  useEffect(() => {
    // TODO project 分页
    apiClient.project.getAllPaginated(1, 50).then((res) => {
      const data = res.data
      setProjects(data)
    })
  }, [])

  return (
    <section className={styles['root']} key={'list'}>
      <div className="grid grid-cols-6 <sm:grid-cols-3 <md:grid-cols-4 gap-12">
        {projects.map((project) => {
          return (
            <Link
              href="projects/[id]"
              as={`projects/${project.id}`}
              key={project.id}
            >
              <a className="flex flex-col">
                <ProjectIcon avatar={project.avatar} alt={project.name} />
                <h4>{project.name}</h4>
              </a>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
