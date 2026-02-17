import { useCallback } from 'react'
import useSWR from 'swr'

import { useUserStore } from '~/atoms/user'
import { Seo } from '~/components/app/Seo'
import { ProjectList } from '~/components/in-page/Project/list'
import { CodiconGithubInverted } from '~/components/ui/Icons/menu-icon'
import { Loading } from '~/components/ui/Loading'
import { BottomToUpTransitionView } from '~/components/ui/Transition/BottomToUpTransitionView'
import { TrackerAction } from '~/constants/tracker'
import { useAnalyze } from '~/hooks/app/use-analyze'
import { apiClient } from '~/utils/client'

const ProjectView = () => {
  const { data: projects, isLoading: loading } = useSWR(`project`, () =>
    apiClient.project.getAll().then((res) => {
      return res.data
    }),
  )

  const { event } = useAnalyze()
  const githubUsername = useUserStore(
    (state) => state.master?.socialIds?.github,
  )
  const trackerClick = useCallback(() => {
    event({
      action: TrackerAction.Click,
      label: '项目页 GitHub 图标点击',
    })
  }, [])
  return (
    <main>
      <Seo title="项目" />

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="my-12 inline-flex items-center text-3xl font-medium">
            项目{' '}
            {githubUsername && (
              <a
                href={`https://github.com/${githubUsername}`}
                className="ml-2 inline-flex !text-inherit"
                target="_blank"
                aria-label="view on GitHub"
                onClick={trackerClick} rel="noreferrer"
              >
                <CodiconGithubInverted />
              </a>
            )}
          </div>
          <BottomToUpTransitionView>
            <ProjectList projects={projects || []} />
          </BottomToUpTransitionView>
        </>
      )}
    </main>
  )
}

export default ProjectView
