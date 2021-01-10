/*
 * @Author: Innei
 * @Date: 2021-01-10 12:05:07
 * @LastEditTime: 2021-01-10 13:17:49
 * @LastEditors: Innei
 * @FilePath: /web/components/Comment/editor.tsx
 * @Mark: Coding with Love
 */

import classNames from 'classnames'
import { Input, InputContext } from 'components/Input'
import {
  ContentBlock,
  convertFromRaw,
  convertToRaw,
  Editor,
  EditorState,
} from 'draft-js'
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js'
import dynamic from 'next/dynamic'
import React, { FC, useCallback, useMemo, useRef, useState } from 'react'
import styles from './editor.module.scss'

interface TextAreaEditorProps {
  value: string
  onChange?: (val: string) => void
}

const _TextAreaEditor: FC<TextAreaEditorProps> = (props) => {
  const { value, onChange } = props
  const contentState = useMemo(() => {
    const rawData = markdownToDraft(value, {
      remarkableOptions: {
        disable: {
          block: ['heading', 'table'],
        },
      },
    })
    const contentState = convertFromRaw(rawData)
    return contentState
  }, [])

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(contentState),
  )
  const editorRef = useRef<Editor>(null)

  const blockStyleFn = (contentBlock: ContentBlock) => {
    const type = contentBlock.getType()

    switch (type) {
      default:
        return type
    }
  }
  const getMarkdown = useCallback(() => {
    const content = editorState.getCurrentContent()
    return draftToMarkdown(convertToRaw(content))
  }, [editorState])
  const handleFocus = useCallback(() => {
    if (!editorRef.current) {
      return
    }

    editorRef.current.focus()
  }, [])

  const handleChange = useCallback(
    (editorState: EditorState) => {
      setEditorState(editorState)
      onChange?.(getMarkdown())
    },
    [getMarkdown, onChange],
  )
  return (
    <Input
      wrapperProps={{
        className: classNames(styles['root']),
        onClick: handleFocus,
      }}
    >
      <InputContext.Consumer>
        {({ setFocus }) => {
          return (
            <div className={styles['editor-wrapper']}>
              <Editor
                ref={editorRef}
                editorState={editorState}
                onChange={handleChange}
                onBlur={() => {
                  setFocus(false)
                }}
                onFocus={() => {
                  setFocus(true)
                }}
                blockStyleFn={blockStyleFn}
              />
            </div>
          )
        }}
      </InputContext.Consumer>
    </Input>
  )
}
export const TextAreaEditor = dynamic(() => Promise.resolve(_TextAreaEditor), {
  ssr: false,
})
