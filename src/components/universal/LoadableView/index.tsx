import { observer } from 'mobx-react-lite'
import type { NextPage } from 'next'
import React, { Fragment, memo, useEffect } from 'react'

import type { LoadingProps } from '~/components/universal/Loading'
import { Loading } from '~/components/universal/Loading'
import type { Store } from '~/store/helper/base'

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
  View: PageOnlyProps,
): NextPage<T> {
  return observer((props: Props) => {
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
