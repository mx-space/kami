import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ProjectModel } from '@mx-space/api-client'
import { ProjectList } from 'components/in-page/Project/list'
import { Loading } from 'components/universal/Loading'
import { BottomUpTransitionView } from 'components/universal/Transition/bottom-up'
import { useEffect, useState } from 'react'
import { useStore } from 'store'
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
  const { userStore } = useStore()
  const githubUsername = userStore.master?.socialIds?.github
  return (
    <main>
      <SEO title={'项目'} />

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="font-medium text-3xl my-12">
            项目{' '}
            {githubUsername && (
              <a
                href={'https://github.com/' + githubUsername}
                className="!text-inherit"
                target="_blank"
                aria-label="view on GitHub"
              >
                <FontAwesomeIcon icon={faGithub} />
              </a>
            )}
          </div>
          <BottomUpTransitionView>
            <ProjectList projects={projects} />
          </BottomUpTransitionView>
        </>
      )}
    </main>
  )
}

export default ProjectView
