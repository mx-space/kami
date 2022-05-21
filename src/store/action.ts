/*
 * @Author: Innei
 * @Date: 2020-08-07 16:56:07
 * @LastEditTime: 2020-08-08 13:26:25
 * @LastEditors: Innei
 * @FilePath: /mx-web/common/store/action.ts
 * @Coding with Love
 */
import { makeAutoObservable } from 'mobx'

import type { FootAction } from './types/actions'

export default class ActionStore {
  constructor() {
    makeAutoObservable(this)
  }
  private _actions: FootAction[] = []

  resetActions() {
    this._actions = []
  }

  /**
   * clear and set actions (replace)
   * @param actions
   */
  setActions(actions: FootAction[]) {
    this.resetActions()
    this._actions.push(...actions)
  }

  appendActions(actions: FootAction[] | FootAction) {
    if (Array.isArray(actions)) {
      this._actions.push(...actions)
    } else {
      this._actions.push(actions)
    }
  }

  removeAction(action: FootAction) {
    const index = this._actions.indexOf(action)
    if (index !== -1) {
      this._actions.splice(index, 1)
    }
  }
  removeActionByIndex(index: number) {
    if (index !== -1) {
      this._actions.splice(index, 1)
    }
  }

  removeActionBySymbol(id: symbol) {
    const index = this._actions.findIndex((i) => i.id === id)

    this.removeActionByIndex(index)
  }
  get actions() {
    return [...this._actions]
  }
}
