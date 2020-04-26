import { NextPage } from 'next'
import defaultImage from 'assets/images/Kico.jpg'
import { Rest } from 'utils/api'
import { ProjectRespModel, ProjectModel } from 'models/dto/project'
import Link from 'next/link'
import { Image } from 'components/Image'

interface ProjectViewProps {
  projects: ProjectModel[]
}

const ProjectView: NextPage<ProjectViewProps> = (props) => {
  const { projects } = props

  return (
    <main>
      <section className={'project-list'}>
        <div className="row">
          <div className="col-4 col-s-3 col-m-2">
            {projects.map((project) => {
              return (
                <Link
                  href="projects/[id]"
                  as={`projects/${project._id}`}
                  key={project._id}
                >
                  <a>
                    <Image
                      src={project.avatar ?? defaultImage}
                      alt={project.name}
                      defaultImage={defaultImage}
                    />
                    <h4>{project.name}</h4>
                  </a>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

ProjectView.getInitialProps = async (): Promise<ProjectViewProps> => {
  const { data } = (await Rest('Project').gets({
    size: 50,
  })) as ProjectRespModel
  return { projects: data }
}

export default ProjectView
