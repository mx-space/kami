import type { NextPage } from 'next'

import type { ProjectModel } from '@mx-space/api-client'

import { useProjectCollection } from '~/atoms/collections/project'
import { wrapperNextPage } from '~/components/app/WrapperNextPage'
import { SEO } from '~/components/biz/Seo'
import { ProjectDetail } from '~/components/in-page/Project/detail'
import { useSyncEffectOnce } from '~/hooks/use-sync-effect'
import { apiClient } from '~/utils/client'

type ProjectViewProps = ProjectModel

const ProjectView: NextPage<ProjectViewProps> = (props) => {
  useSyncEffectOnce(() => {
    useProjectCollection.getState().add(props)
  })

  return (
    <main>
      <SEO
        {...{
          title: props.name,
          description: props.description,
        }}
      />

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
