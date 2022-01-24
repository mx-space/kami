import { ProjectModel } from '@mx-space/api-client'
import { ProjectList } from 'components/in-page/Project/list'
import { Loading } from 'components/universal/Loading'
import { useEffect, useState } from 'react'
import { apiClient } from 'utils'
import { QueueAnim } from '../../components/universal/Anime'
import { SEO } from '../../components/universal/Seo'

const ProjectView = () => {
  const [projects, setProjects] = useState<ProjectModel[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    apiClient.project
      .getAll()
      .then((res) => {
        const data = res.data
        setProjects(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <main>
      <SEO title={'项目'} />
      {loading && <Loading />}
      <QueueAnim type={'bottom'}>
        <ProjectList projects={projects} />
      </QueueAnim>
    </main>
  )
}

export default ProjectView
