import { observer } from 'utils/mobx'
import React, { FC, useCallback } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { useStore } from '../../common/store'
import dark from 'react-syntax-highlighter/dist/cjs/styles/prism/tomorrow'
import light from 'react-syntax-highlighter/dist/cjs/styles/prism/prism'
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript'
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css'
import java from 'react-syntax-highlighter/dist/cjs/languages/prism/java'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx'
import csharp from 'react-syntax-highlighter/dist/cjs/languages/prism/csharp'
import swift from 'react-syntax-highlighter/dist/cjs/languages/prism/swift'
import objectivec from 'react-syntax-highlighter/dist/cjs/languages/prism/objectivec'
import c from 'react-syntax-highlighter/dist/cjs/languages/prism/c'
import clike from 'react-syntax-highlighter/dist/cjs/languages/prism/clike'
import cpp from 'react-syntax-highlighter/dist/cjs/languages/prism/cpp'
import rust from 'react-syntax-highlighter/dist/cjs/languages/prism/rust'
import go from 'react-syntax-highlighter/dist/cjs/languages/prism/go'
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python'
import extras from 'react-syntax-highlighter/dist/cjs/languages/prism/css-extras'
import sass from 'react-syntax-highlighter/dist/cjs/languages/prism/sass'
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss'
import applescript from 'react-syntax-highlighter/dist/cjs/languages/prism/applescript'
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash'
import coffeescript from 'react-syntax-highlighter/dist/cjs/languages/prism/coffeescript'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json'
import nginx from 'react-syntax-highlighter/dist/cjs/languages/prism/nginx'
import apacheconf from 'react-syntax-highlighter/dist/cjs/languages/prism/apacheconf'
import git from 'react-syntax-highlighter/dist/cjs/languages/prism/git'
import docker from 'react-syntax-highlighter/dist/cjs/languages/prism/docker'
import yaml from 'react-syntax-highlighter/dist/cjs/languages/prism/yaml'
import vim from 'react-syntax-highlighter/dist/cjs/languages/prism/vim'
import php from 'react-syntax-highlighter/dist/cjs/languages/prism/php'
import dart from 'react-syntax-highlighter/dist/cjs/languages/prism/dart'
import kotlin from 'react-syntax-highlighter/dist/cjs/languages/prism/kotlin'
import graphql from 'react-syntax-highlighter/dist/cjs/languages/prism/graphql'
import pug from 'react-syntax-highlighter/dist/cjs/languages/prism/pug'
import rest from 'react-syntax-highlighter/dist/cjs/languages/prism/rest'
import http from 'react-syntax-highlighter/dist/cjs/languages/prism/http'

import styles from './index.module.scss'
import { message } from 'antd'
import { copy } from '../../utils/dom'

const lang = {
  javascript,
  css,
  java,
  typescript,
  tsx,
  jsx,
  csharp,
  swift,
  objectivec,
  c,
  clike,
  cpp,
  rust,
  go,
  python,
  extras,
  sass,
  scss,
  applescript,
  bash,
  coffeescript,
  json,
  nginx,
  apacheconf,
  git,
  docker,
  yaml,
  vim,
  php,
  dart,
  kotlin,
  graphql,
  pug,
  rest,
  http,
}
Object.entries(lang).map(([k, v]) => SyntaxHighlighter.registerLanguage(k, v))
interface CodeBlockProps {
  language: string | undefined
  value: string
}
const CodeBlock: FC<CodeBlockProps> = observer((props) => {
  const { language, value } = props
  const { colorMode } = useStore().appStore
  const handleCopy = useCallback(() => {
    copy(value)
    message.success('COPIED! NOW YOU CAN ENJOY CV.')
  }, [value])
  return (
    <div className={styles['code-wrap']}>
      <SyntaxHighlighter
        language={language}
        style={colorMode === 'dark' ? dark : light}
        showLineNumbers={true}
        showInlineLineNumbers={true}
        customStyle={{
          background: 'var(--code-bg) !important',
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
export default CodeBlock
