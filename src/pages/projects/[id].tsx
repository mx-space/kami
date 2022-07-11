import type { NextPage } from 'next'

import type { ProjectModel } from '@mx-space/api-client'

import { wrapperNextPage } from '~/components/biz/WrapperNextPage'
import { ProjectDetail } from '~/components/in-page/Project/detail'
import { useStore } from '~/store'
import { apiClient } from '~/utils/client'

import { SEO } from '../../components/biz/Seo'

type ProjectViewProps = ProjectModel

const ProjectView: NextPage<ProjectViewProps> = (props) => {
  const store = useStore()
  store.projectStore.add(props)

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
  const data = await apiClient.project.getById(id)
  return data
}

export default wrapperNextPage(ProjectView)
