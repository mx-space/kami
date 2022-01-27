import { ProjectModel } from '@mx-space/api-client'
import { ProjectList } from 'components/in-page/Project/list'
import { Loading } from 'components/universal/Loading'
import { BottomUpTransitionView } from 'components/universal/Transition/bottom-up'
import { useEffect, useState } from 'react'
import { apiClient } from 'utils'
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
      {/* {loading && <Loading />} */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="font-medium text-3xl my-12">
            {/* <button>项目</button> / <button>GitHub</button> */}
            项目
          </div>
          <BottomUpTransitionView>
            <ProjectList projects={projects} />
          </BottomUpTransitionView>
        </>
      )}
      {/* TODO fetch github repo */}
    </main>
  )
}

export default ProjectView
