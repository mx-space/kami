import type { NextPage } from 'next'

import type { ProjectModel } from '@mx-space/api-client'

import { useProjectCollection } from '~/atoms/collections/project'
import { Seo } from '~/components/app/Seo'
import { wrapperNextPage } from '~/components/app/WrapperNextPage'
import { ProjectDetail } from '~/components/in-page/Project/detail'
import { useSyncEffectOnce } from '~/hooks/common/use-sync-effect'
import { apiClient } from '~/utils/client'

type ProjectViewProps = ProjectModel

const ProjectView: NextPage<ProjectViewProps> = (props) => {
  useSyncEffectOnce(() => {
    useProjectCollection.getState().add(props)
  })

  return (
    <main>
      <Seo title={props.name} description={props.description} />

      <ProjectDetail id={props.id} />
    </main>
  )
}

ProjectView.getInitialProps = async (ctx) => {
  const { query } = ctx
  const id = query.id as string
  return await apiClient.project.getById(id)
}

export default wrapperNextPage(ProjectView)
