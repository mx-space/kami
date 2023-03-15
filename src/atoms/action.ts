import { create } from 'zustand'

export type FootAction = {
  id: string
  icon: React.ReactNode
  onClick: () => void | Promise<void>
  element?: JSX.Element
}

interface ActionState {
  actions: FootAction[]

  appendActions(actions: FootAction[] | FootAction): void
  removeActionByIndex(index: number): void
  removeActionById(id: string): void
}

export const useActionStore = create<ActionState>((setState, getState) => {
  return {
    actions: [] as FootAction[],
    appendActions(actions: FootAction[] | FootAction) {
      if (Array.isArray(actions)) {
        setState({ actions: [...getState().actions, ...actions] })
      } else {
        setState({ actions: [...getState().actions, actions] })
      }
    },
    removeActionByIndex(index: number) {
      if (index !== -1) {
        const actions = getState().actions
        actions.splice(index, 1)
        setState({ actions: actions.concat() })
      }
    },
    removeActionById(id: string) {
      const index = getState().actions.findIndex((i) => i.id === id)

      getState().removeActionByIndex(index)
    },
  }
})
