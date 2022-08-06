import { ErrorView } from '~/components/app/Error'

export default function () {
  return <ErrorView statusCode={'📶!'} description={'您处于离线模式'} />
}
