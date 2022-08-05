import { useCallback, useEffect, useState } from 'react'

import type { ProjectModel } from '@mx-space/api-client'

import { ProjectList } from '~/components/in-page/Project/list'
import { CodiconGithubInverted } from '~/components/universal/Icons/menu-icon'
import { Loading } from '~/components/universal/Loading'
import { BottomUpTransitionView } from '~/components/universal/Transition/bottom-up'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/use-analyze'
import { useStore } from '~/store'
import { apiClient } from '~/utils/client'

import { SEO } from '../../components/biz/Seo'

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
  const { event } = useAnalyze()
  const githubUsername = userStore.master?.socialIds?.github
  const trackerClick = useCallback(() => {
    event({
      action: TrackerAction.Click,
      label: '项目页 GitHub 图标点击',
    })
  }, [])
  return (
    <main>
      <SEO title={'项目'} />

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="font-medium text-3xl my-12 inline-flex items-center">
            项目{' '}
            {githubUsername && (
              <a
                href={`https://github.com/${githubUsername}`}
                className="!text-inherit inline-flex ml-2"
                target="_blank"
                aria-label="view on GitHub"
                onClick={trackerClick}
              >
                <CodiconGithubInverted />
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
