export interface XLogMeta {
  pageId?: string
  cid?: string
  relatedUrls?: string[]
  metadata?: {
    network: string
    proof: string
    raw?: {
      [key: string]: any
    }
    owner?: string
    transactions?: string[]
    [key: string]: any
  }

  /** @deprecated */
  ipfs?: string
}
