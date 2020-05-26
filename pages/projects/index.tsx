import defaultImage from 'assets/images/Kico.jpg'
import { ImageLazy } from 'components/Image'
import { ProjectModel, ProjectRespModel } from 'models/dto/project'
import { NextPage } from 'next'
import Link from 'next/link'
import { Rest } from 'utils/api'
import { QueueAnim } from '../../components/Anime'
import { SEO } from '../../components/SEO'

interface ProjectViewProps {
  projects: ProjectModel[]
}

const ProjectView: NextPage<ProjectViewProps> = (props) => {
  const { projects } = props

  return (
    <main>
      <SEO title={'项目'} />
      <QueueAnim type={'bottom'}>
        <section className={'project-list'} key={'a'}>
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
                      <ImageLazy
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
      </QueueAnim>
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
