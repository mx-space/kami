/*
 * @Author: Innei
 * @Date: 2021-05-29 19:31:30
 * @LastEditTime: 2021-06-27 16:31:52
 * @LastEditors: Innei
 * @FilePath: /web/components/CodeHighlighter/index.tsx
 * Mark: Coding with Love
 */
import dynamic from 'next/dynamic'
import React, { FC, useCallback } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import conf from 'react-syntax-highlighter/dist/cjs/languages/prism/apacheconf'
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash'
import c from 'react-syntax-highlighter/dist/cjs/languages/prism/c'
import cpp from 'react-syntax-highlighter/dist/cjs/languages/prism/cpp'
import csharp from 'react-syntax-highlighter/dist/cjs/languages/prism/csharp'
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css'
import docker from 'react-syntax-highlighter/dist/cjs/languages/prism/docker'
import git from 'react-syntax-highlighter/dist/cjs/languages/prism/git'
import go from 'react-syntax-highlighter/dist/cjs/languages/prism/go'
import graphql from 'react-syntax-highlighter/dist/cjs/languages/prism/graphql'
import java from 'react-syntax-highlighter/dist/cjs/languages/prism/java'
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json5'
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx'
import kotlin from 'react-syntax-highlighter/dist/cjs/languages/prism/kotlin'
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python'
import rust from 'react-syntax-highlighter/dist/cjs/languages/prism/rust'
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss'
import swift from 'react-syntax-highlighter/dist/cjs/languages/prism/swift'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import yaml from 'react-syntax-highlighter/dist/cjs/languages/prism/yaml'
import light from 'react-syntax-highlighter/dist/cjs/styles/prism/prism'
import dark from 'react-syntax-highlighter/dist/cjs/styles/prism/tomorrow'
import { message } from 'utils/message'
import { observer } from 'utils/mobx'
import { appUIStore, useStore } from '../../common/store'
import styles from './index.module.css'

const lang = {
  conf,
  bash,
  c,
  cpp,
  csharp,
  css,
  docker,
  git,
  go,
  graphql,
  java,
  javascript,
  js: javascript,
  json,
  jsx,
  kotlin,
  python,
  rust,
  scss,
  swift,
  tsx,
  typescript,
  ts: typescript,
  yaml,
}
Object.entries(lang).map(([k, v]) => SyntaxHighlighter.registerLanguage(k, v))
interface Props {
  language: string | undefined
  value: string
}
const HighLighter: FC<Props> = observer((props) => {
  const { language, value } = props

  const { colorMode } = useStore().appStore
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    message.success('COPIED!')
  }, [value])
  const isPrintMode = appUIStore.mediaType === 'print'

  return (
    <div className={styles['code-wrap']}>
      <span className={styles['language-tip']}>{language}</span>
      <SyntaxHighlighter
        language={language}
        style={colorMode === 'dark' && !isPrintMode ? dark : light}
        showLineNumbers={true}
        showInlineLineNumbers={true}
        customStyle={{
          background: 'var(--code-bg) !important',
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {value}
      </SyntaxHighlighter>
      <div className={styles['copy-tip']} onClick={handleCopy}>
        Copy
      </div>
    </div>
  )
})
export default dynamic(() => Promise.resolve(HighLighter), { ssr: false })
