import { default as React, FC } from 'react'
export const RenderSpoiler: FC<{ value: string }> = (props) => {
  return (
    <del className={'spoiler'} title={'你知道的太多了'}>
      {props.value}
    </del>
  )
}
export const RenderParagraph: FC<{}> = (props) => {
  return <p className={'paragraph'}>{props.children}</p>
}
export const RenderCommentAt: FC<{ value: string }> = ({ value }) => {
  return <>@{value}</>
}

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
  const isChecked = typeof props.checked == 'boolean'
  return (
    <li className={isChecked ? 'list-none' : ''}>
      {isChecked ? (
        <label className="inline-flex items-center">
          {/*  @ts-ignore */}
          <input type="checkbox" checked={props.checked} readOnly />
          {props.children}
        </label>
      ) : (
        props.children
      )}
    </li>
  )
}
