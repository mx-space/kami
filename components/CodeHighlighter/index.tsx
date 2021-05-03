import dynamic from 'next/dynamic'
import React, { FC, useCallback } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import apacheconf from 'react-syntax-highlighter/dist/cjs/languages/prism/apacheconf'
import applescript from 'react-syntax-highlighter/dist/cjs/languages/prism/applescript'
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash'
import c from 'react-syntax-highlighter/dist/cjs/languages/prism/c'
import clike from 'react-syntax-highlighter/dist/cjs/languages/prism/clike'
import coffeescript from 'react-syntax-highlighter/dist/cjs/languages/prism/coffeescript'
import cpp from 'react-syntax-highlighter/dist/cjs/languages/prism/cpp'
import csharp from 'react-syntax-highlighter/dist/cjs/languages/prism/csharp'
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css'
import extras from 'react-syntax-highlighter/dist/cjs/languages/prism/css-extras'
import dart from 'react-syntax-highlighter/dist/cjs/languages/prism/dart'
import docker from 'react-syntax-highlighter/dist/cjs/languages/prism/docker'
import git from 'react-syntax-highlighter/dist/cjs/languages/prism/git'
import go from 'react-syntax-highlighter/dist/cjs/languages/prism/go'
import graphql from 'react-syntax-highlighter/dist/cjs/languages/prism/graphql'
import http from 'react-syntax-highlighter/dist/cjs/languages/prism/http'
import java from 'react-syntax-highlighter/dist/cjs/languages/prism/java'
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json'
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx'
import kotlin from 'react-syntax-highlighter/dist/cjs/languages/prism/kotlin'
import nginx from 'react-syntax-highlighter/dist/cjs/languages/prism/nginx'
import objectivec from 'react-syntax-highlighter/dist/cjs/languages/prism/objectivec'
import php from 'react-syntax-highlighter/dist/cjs/languages/prism/php'
import pug from 'react-syntax-highlighter/dist/cjs/languages/prism/pug'
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python'
import rest from 'react-syntax-highlighter/dist/cjs/languages/prism/rest'
import rust from 'react-syntax-highlighter/dist/cjs/languages/prism/rust'
import sass from 'react-syntax-highlighter/dist/cjs/languages/prism/sass'
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss'
import swift from 'react-syntax-highlighter/dist/cjs/languages/prism/swift'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import vim from 'react-syntax-highlighter/dist/cjs/languages/prism/vim'
import yaml from 'react-syntax-highlighter/dist/cjs/languages/prism/yaml'
import light from 'react-syntax-highlighter/dist/cjs/styles/prism/prism'
import dark from 'react-syntax-highlighter/dist/cjs/styles/prism/tomorrow'
import { message } from 'utils/message'
import { observer } from 'utils/mobx'
import { appStore, useStore } from '../../common/store'
import styles from './index.module.scss'

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
  const isPrintMode = appStore.mediaType === 'print'

  return (
    <div className={styles['code-wrap']}>
      <SyntaxHighlighter
        language={language}
        style={colorMode === 'dark' && !isPrintMode ? dark : light}
        showLineNumbers={true}
        showInlineLineNumbers={true}
        customStyle={{
          background: 'var(--code-bg) !important',
          padding: 0,
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
