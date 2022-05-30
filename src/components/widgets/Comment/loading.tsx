import React, { memo } from 'react'

import { Loading } from '~/components/universal/Loading'

export const CommentLoading = memo(() => {
  return (
    <>
      <div className="pt-[150px]"></div>
      <Loading loadingText={'正在加载评论区...'}></Loading>
    </>
  )
})
