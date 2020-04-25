import { omit } from 'lodash'
import { Top } from 'models/aggregate'
import { NextPage } from 'next'
import { Rest } from 'utils/api'
import { observer } from 'mobx-react'
import { useStore } from 'store'
const IndexView: NextPage = () => {
  const { userStore, appStore } = useStore()
  const { name, introduce, master } = userStore
  const { avatar } = master
  const { description } = appStore
  return (
    <main>
      <section className="paul-intro">
        <div className="intro-avatar">
          <img src={avatar} alt={name} />
        </div>
        <div className="intro-info">
          <h1>{name}</h1>
          <p>{introduce || description || 'Hello World~'}</p>
          <div className="social-icons"></div>
        </div>
      </section>
    </main>
  )
}
IndexView.getInitialProps = async () => {
  const resp = (await Rest('Aggregate').get('top')) as Top.Aggregate

  return omit(resp, ['ok', 'timestamp'])
}

export default observer(IndexView)
