import { Store } from 'common/store/helper/base'
import { Loading, LoadingProps } from 'components/Loading'
import { observer } from 'mobx-react-lite'
import { NextPage } from 'next'
import React, { Fragment, memo, useEffect } from 'react'

export const LoadableView = memo<
  { data?: null | undefined | object; children?: any } & LoadingProps
>(({ data, ...props }) => {
  if (!data) {
    return <Loading {...props} />
  }

  return React.createElement(Fragment, props.children)
})

type Props = { id: string; [k: string]: any }
export function buildStoreDataLoadableView<T extends { id: string }>(
  store: Store<any>,
  View: React.ElementType,
): NextPage<T> {
  return observer((props: Props) => {
    console.log(props)

    const post = store.get(props.id)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      store.add(props)
    }, [props.id])
    if (!post) {
      return <Loading />
    }
    return <View id={post.id} />
  })
}
