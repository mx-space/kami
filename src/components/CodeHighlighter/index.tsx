import dynamic from 'next/dynamic'
import React, { FC, useCallback, useEffect, useRef } from 'react'
import { loadScript, loadStyleSheet } from 'utils'
import { message } from 'utils/message'
import { observer } from 'utils/mobx'
import { appUIStore, useStore } from '../../common/store'
import styles from './index.module.css'

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

  useEffect(() => {
    const css = loadStyleSheet(
      `https://cdn.jsdelivr.net/gh/PrismJS/prism-themes@master/themes/prism-one-${
        isPrintMode ? 'light' : colorMode
      }.css`,
    )

    return () => {
      css?.remove()
    }
  }, [colorMode, isPrintMode])
  useEffect(() => {
    loadStyleSheet(
      'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism/1.23.0/plugins/line-numbers/prism-line-numbers.min.css',
    )

    Promise.all([
      loadScript(
        'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism/1.23.0/components/prism-core.min.js',
      ),
      loadScript(
        'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism/1.23.0/plugins/autoloader/prism-autoloader.min.js',
      ),
      loadScript(
        'https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/prism/1.23.0/plugins/line-numbers/prism-line-numbers.min.js',
      ),
    ]).then(() => {
      if (ref.current) {
        window.Prism?.highlightElement(ref.current)
      }
    })
  }, [])

  const ref = useRef<HTMLElement>(null)
  return (
    <div className={styles['code-wrap']}>
      <span className={styles['language-tip']}>{language}</span>

      <pre className="line-numbers !bg-transparent" data-start="0">
        <code className={`language-${language ?? 'markup'}`} ref={ref}>
          {value}
        </code>
      </pre>

      <div className={styles['copy-tip']} onClick={handleCopy}>
        Copy
      </div>
    </div>
  )
})
export default dynamic(() => Promise.resolve(HighLighter), { ssr: false })
