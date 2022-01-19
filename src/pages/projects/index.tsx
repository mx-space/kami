import { ProjectModel } from '@mx-space/api-client'
import defaultImage from 'assets/images/Kico.jpg'
import { ImageLazy } from 'components/universal/Image'
import { NextPage } from 'next'
import Link from 'next/link'
import { apiClient } from 'utils/client'
import { QueueAnim } from '../../components/universal/Anime'
import { SEO } from '../../components/universal/Seo'

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
          <div className="grid grid-cols-6 <sm:grid-cols-3 <md:grid-cols-4 gap-5">
            {projects.map((project) => {
              return (
                <div key={project.id}>
                  <Link href="projects/[id]" as={`projects/${project.id}`}>
                    <a>
                      <ImageLazy
                        src={project.avatar ?? defaultImage.src}
                        height={defaultImage.height}
                        width={defaultImage.width}
                        alt={project.name}
                        defaultImage={defaultImage.src}
                      />
                      <h4>{project.name}</h4>
                    </a>
                  </Link>
                </div>
              )
            })}
          </div>
        </section>
      </QueueAnim>
    </main>
  )
}

ProjectView.getInitialProps = async (): Promise<ProjectViewProps> => {
  const { data } = await apiClient.project.getAllPaginated(1, 50)
  return { projects: data }
}

export default ProjectView
