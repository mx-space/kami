import { Image } from '@mx-space/api-client'
import { createContext } from 'react'

export const ImageSizeMetaContext = createContext(
  new Map() as Map<string, Image>,
)
