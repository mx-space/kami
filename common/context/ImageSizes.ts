import { createContext } from 'react'
import { ImageSizeRecord } from '../../models/base'

/*
 * @Author: Innei
 * @Date: 2020-05-31 17:33:14
 * @LastEditTime: 2020-05-31 18:00:17
 * @LastEditors: Innei
 * @FilePath: /mx-web/context/ImageSizes.ts
 * @Coding with Love
 */
export const imageSizesContext = createContext([] as ImageSizeRecord[])
