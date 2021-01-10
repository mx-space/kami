import {
  ContentBlock,
  convertFromRaw,
  convertToRaw,
  Editor,
  EditorState,
} from 'draft-js'
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js'
import dynamic from 'next/dynamic'
import React, { createRef, PureComponent } from 'react'
import styles from './editor.module.scss'

interface State {
  editorState: EditorState
  confirm: boolean
}

interface Props {
  md: string
  onFinish?: (md: string) => void
  onChange?: (md: string) => void
  onCancel: () => void
}

class _DraftEditor extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    const md = this.props.md
    const rawData = markdownToDraft(md, {
      blockEntities: {
        image: function (item) {
          return {
            type: 'atomic',
            mutability: 'IMMUTABLE',
            data: {
              src: item.src,
            },
          }
        },
      },
    })
    const contentState = convertFromRaw(rawData)
    const newEditorState = EditorState.createWithContent(contentState)

    this.state = {
      editorState: newEditorState,
      confirm: false,
    }
  }
  getMarkdown = () => {
    const content = this.state.editorState.getCurrentContent()
    return draftToMarkdown(convertToRaw(content))
  }
  state = {
    editorState: EditorState.createEmpty(),
    confirm: false,
  }
  focus = () => {
    this.ref.current?.focus()
  }
  onChange = (editorState: EditorState) => {
    this.setState({ editorState })
    this.props.onChange?.(this.getMarkdown())
  }
  ref = createRef<Editor>()

  blockStyleFn = (contentBlock: ContentBlock) => {
    const type = contentBlock.getType()
    // console.log(type)

    switch (type) {
      case 'unstyled':
        return 'paragraph'

      default:
        return type
    }
  }

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.editor} onClick={this.focus}>
          <Editor
            editorState={this.state.editorState}
            blockStyleFn={this.blockStyleFn}
            onChange={this.onChange}
            ref={this.ref}
          />
        </div>
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            color: '#fff',
          }}
        >
          <span>只支持纯文字 (Preview)</span>

          <div>
            <div
              style={{ marginRight: '1em' }}
              className="btn red"
              onClick={this.props.onCancel}
            >
              取消
            </div>
            <div
              className="btn yellow"
              onClick={() => {
                if (this.state.confirm) {
                  this.props.onFinish?.(this.getMarkdown())
                } else {
                  console.log(this.getMarkdown())
                  this.setState({
                    confirm: true,
                  })
                }
              }}
            >
              {this.state.confirm ? 'OK!' : 'OK?'}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export const DraftEditor = dynamic(() => Promise.resolve(_DraftEditor), {
  ssr: false,
})
