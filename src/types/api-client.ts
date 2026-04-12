import type { XLogMeta } from './xlog'

export interface KamiMeta {
  style?: string
  cover?: string
  banner?: string | { type: string; message: string }
  xLog?: XLogMeta
  music?: string
}

export type WithMeta<T> = T & {
  meta?: KamiMeta | null
}
