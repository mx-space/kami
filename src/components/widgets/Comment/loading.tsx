import React, { memo } from 'react'

import { Loading } from '~/components/ui/Loading'

export const CommentLoading = memo(() => {
  return (
    <>
      <div className="pt-[150px]" />
      <Loading loadingText="正在加载评论区..." />
    </>
  )
})
