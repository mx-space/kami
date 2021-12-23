import { useStore } from 'common/store'
import Toc from 'components/Toc'
import React, { FC } from 'react'
import { observer } from 'utils/mobx'

export const RenderSpoiler: FC<{ value: string }> = (props) => {
  return (
    <del className={'spoiler'} title={'你知道的太多了'}>
      {props.value}
    </del>
  )
}
export const RenderParagraph: FC<{}> = (props) => {
  return <div className={'paragraph'}>{props.children}</div>
}
export const RenderCommentAt: FC<{ value: string }> = ({ value }) => {
  return <>@{value}</>
}
export const _TOC: FC = observer(() => {
  const { appStore } = useStore()
  const { isPadOrMobile } = appStore
  return !isPadOrMobile ? <Toc /> : null
})
