import { useStore } from 'common/store'
import React, { FC } from 'react'
import { observer } from 'utils/mobx'
import Toc from 'views/Toc'
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

export const RenderReference: FC<{ href: string; title: string | null }> = (
  props,
) => {
  return (
    <sup>
      <a title={props.title || undefined} href={props.href}>
        {props.children}
      </a>
    </sup>
  )
}

export const RenderListItem: FC<{ checked?: null | undefined | boolean }> = (
  props,
) => {
  return (
    <li>
      {typeof props.checked == 'boolean' ? (
        <label className="flex items-center">
          <input type="checkbox" checked={props.checked} />
          {props.children}
        </label>
      ) : (
        props.children
      )}
    </li>
  )
}
