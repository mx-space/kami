/*
 * @Author: Innei
 * @Date: 2020-05-23 13:35:49
 * @LastEditTime: 2020-05-23 13:35:49
 * @LastEditors: Innei
 * @FilePath: /mx-web/store/gateway.ts
 * @MIT
 */

import { observable } from 'mobx'

export default class GatewayStore {
  @observable online = 0
}
