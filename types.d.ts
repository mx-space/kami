import { InitialDataType } from 'context/initial-data'
import { FC } from 'react'

declare global {
  export interface History {
    backPath: string[]
  }
  export interface Window {
    [key: string]: any

    data?: InitialDataType
  }

  export type IdProps = { id: string }
  export type PageOnlyProps = FC<IdProps>
}

declare module 'react' {
  export interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    'data-hide-print'?: boolean
  }
}

export {}
