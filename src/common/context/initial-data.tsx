import { AggregateRoot } from '@mx-space/api-client'
import Head from 'next/head'
import { createContext, FC, memo, useEffect } from 'react'
import { KamiConfig } from 'types/config'
import { loadScript } from 'utils'

export type InitialDataType = {
  aggregateData: AggregateRoot
  config: KamiConfig
}
export const InitialContext = createContext({} as InitialDataType)

export const InitialContextProvider: FC<{ value: InitialDataType }> = memo(
  (props) => {
    useEffect(() => {
      window.data = props.value
    }, [props.value])
    const { css, js, script, style } = props.value.config.site.custom

    useEffect(() => {
      js && js.length && js.forEach((src, i) => loadScript(src))
    }, [])

    return (
      <InitialContext.Provider value={props.value}>
        <Head>
          {script ? (
            <script dangerouslySetInnerHTML={{ __html: script }} defer></script>
          ) : null}

          {style ? (
            <style dangerouslySetInnerHTML={{ __html: style }}></style>
          ) : null}
          {css && css.length
            ? css.map((href, i) => (
                <link rel="stylesheet" href={href} key={i} />
              ))
            : null}
        </Head>
        {props.children}
      </InitialContext.Provider>
    )
  },
)
