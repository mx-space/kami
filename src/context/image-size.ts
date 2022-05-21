import { createContext } from 'react'

import type { Image } from '@mx-space/api-client'

export const ImageSizeMetaContext = createContext(
  new Map() as Map<string, Image>,
)
