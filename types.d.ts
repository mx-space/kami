import { InitialDataType } from 'common/context/initial-data'

/*
 * @Author: Innei
 * @Date: 2021-06-27 16:17:22
 * @LastEditTime: 2021-06-27 16:18:03
 * @LastEditors: Innei
 * @FilePath: /web/types.d.ts
 * Mark: Coding with Love
 */
declare global {
  export interface History {
    backPath: string[]
  }
  export interface Window {
    [key: string]: any

    data?: InitialDataType
  }
}

declare module 'react' {
  export interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    'data-hide-print'?: boolean
  }
}

export {}
