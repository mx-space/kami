import { Loading } from 'components/universal/Loading'
import React, { memo } from 'react'

export const CommentLoading = memo(() => {
  return (
    <>
      <div className="pt-[150px]"></div>
      <Loading loadingText={'正在加载评论区...'}></Loading>
    </>
  )
})
