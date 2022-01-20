import { ProjectList } from 'components/in-page/Project/list'
import { QueueAnim } from '../../components/universal/Anime'
import { SEO } from '../../components/universal/Seo'

const ProjectView = () => {
  return (
    <main>
      <SEO title={'项目'} />
      <QueueAnim type={'bottom'}>
        <ProjectList />
      </QueueAnim>
    </main>
  )
}

export default ProjectView
