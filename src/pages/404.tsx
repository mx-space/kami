import type { NextPage } from 'next'

import { ErrorView } from '~/components/app/Error'

const Custom404: NextPage = () => {
  return <ErrorView statusCode={404} showBackButton showRefreshButton />
}

export default Custom404

