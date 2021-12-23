import { createContext } from 'react'
import { ImageMap } from '../../models/base'

/*
 * @Author: Innei
 * @Date: 2020-05-31 17:33:14
 * @LastEditTime: 2020-07-26 19:53:39
 * @LastEditors: Innei
 * @FilePath: /mx-web/common/context/ImageSizes.ts
 * @Coding with Love
 */
export const ImageSizeMetaContext = createContext(new Map() as ImageMap)
