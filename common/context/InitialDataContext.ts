/*
 * @Author: Innei
 * @Date: 2020-09-02 13:34:39
 * @LastEditTime: 2020-09-02 13:37:51
 * @LastEditors: Innei
 * @FilePath: /mx-web/common/context/InitialDataContext.ts
 * @Coding with Love
 */
import { AggregateResp } from 'models/aggregate'
import { createContext, useContext } from 'react'

const context = createContext({} as AggregateResp)
export const useInitialData = () => {
  return useContext(context)
}
export { context as InitialContext }
