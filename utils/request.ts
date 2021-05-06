/*
 * @Author: Innei
 * @Date: 2020-05-07 16:04:24
 * @LastEditTime: 2020-08-16 21:43:44
 * @LastEditors: Innei
 * @FilePath: /mx-web/utils/request.ts
 * @MIT
 */

import { message } from 'utils/message'
import axios, { AxiosError } from 'axios'
import { getToken } from './cookie'
import { isClientSide, isServerSide } from './utils'
import ky from 'ky'
import camelcaseKeys from 'camelcase-keys'

const base = ky.create({
  prefixUrl: process.env.APIURL || '/api',
  timeout: 1e5,
  parseJson: (json) => camelcaseKeys(JSON.parse(json), { deep: true }),

  // retry: { maxRetryAfter: 1, limit: 1 },
})

export const ky$ = base.extend({
  hooks: {
    beforeRequest: [
      (req) => {
        const token = getToken()
        if (token) {
          req.headers.append('Authorization', 'bearer ' + token)
        }
      },
    ],

    afterResponse: [
      // @ts-ignore
      async (req, _, res) => {
        // console.log(res)

        if (!res.ok && isClientSide()) {
          const payload = await res.json()
          const fromMessage = payload.message
          if (Array.isArray(fromMessage)) {
            fromMessage.map((m) => {
              message.error(m)
            })
          } else {
            message.error(fromMessage)
          }

          return {
            statusCode: res.status,
            data: payload,
          }
        }
      },
    ],
    // beforeRetry: [
    //   ({ error }) => {
    //     console.dir(error.message)
    //   },
    // ],
  },
  throwHttpErrors: true,
})

// @ts-ignore
globalThis.a = ky$

export default ky$
