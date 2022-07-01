import { uniqueId } from 'lodash-es'
import type {
  FC,
  FunctionComponentElement,
  ReactChildren,
  ReactElement,
  ReactNode,
} from 'react'
import React, {
  createContext,
  createElement,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'

import { useIsClient } from '~/hooks/use-is-client'

import type { ModalProps, ModalRefObject } from '.'
import { Modal } from '.'
import type { OverlayProps } from '../Overlay'
import { OverLay } from '../Overlay'

type Disposer = () => void

export type ModalStackContextType = {
  /**
   * 递交一个 Modal
   */
  present<T>(comp: IModalStackComponent<T>): Disposer
  /**
   * 获取当前所有的 ModalStack
   */
  getStack: () => IModalStackStateType[]
  /**
   * 根据 Name 找到 Modal 实例
   */
  findCurrentByName: (name: string) => IModalStackStateType | undefined
  /**
   * 销毁所有 Modal
   */
  disposeAll: (immediately?: boolean) => Promise<void>
}

const ModalStackContext = createContext<ModalStackContextType>({
  present: () => () => void 0,
  getStack: () => [],
  findCurrentByName: () => void 0,
  disposeAll: () => Promise.resolve(undefined),
})

export const useModalStack = () => useContext(ModalStackContext)

export interface IModalStackComponent<T = any> extends UniversalProps {
  /**
   * 传递一个 Modal 组件
   */
  component: ReactNode | ReactElement | React.FC<T>
  /**
   * 传递组件的 props, 可以是一个函数, 如果是函数, 则会在 Modal 出现的时候调用获取 props
   */
  props?: T | (() => T)
  /**
   * 传递 Modal 的 Props
   */
  modalProps?: ModalProps
}

interface UniversalProps {
  overlayProps?: OverlayProps
  name?: string
}

interface IModalStackStateType extends UniversalProps {
  component: FunctionComponentElement<any>
  id: string
  disposer: Disposer
}

export const ModalStackProvider: FC<{
  children?: ReactNode | ReactChildren
}> = (props) => {
  const { children } = props
  const [modalStack, setModalStack] = useState<IModalStackStateType[]>([])

  const modalRefMap = useRef(
    new WeakMap<FunctionComponentElement<any>, ModalRefObject>(),
  )

  const present = useCallback((comp: IModalStackComponent): Disposer => {
    const { component, props, modalProps, ...rest } = comp

    const id = uniqueId('modal-stack-')
    const disposer = () => {
      setModalStack((stack) => {
        return stack.filter((item) => item.id !== id)
      })
    }

    let $modalElement: FunctionComponentElement<any>
    if (React.isValidElement(component)) {
      $modalElement = createElement(
        Modal,
        {
          ...modalProps,
          ref: (ins) => {
            modalRefMap.current.set($modalElement, ins!)
          },
        },
        component,
      )

      // JSX
    } else if (typeof component === 'function') {
      // React.FC

      $modalElement = createElement(
        Modal,
        {
          ...modalProps,
          ref(ins) {
            modalRefMap.current.set($modalElement, ins!)
          },
        },
        createElement(
          component as any,
          typeof props === 'function' ? props() : props,
        ),
      )
    } else {
      console.error(
        'ModalStackProvider: component must be ReactElement or React.FC',
      )
      return () => null
    }

    setModalStack((stack) => {
      return [
        ...stack,
        {
          component: $modalElement,
          id,
          disposer,
          ...rest,
        },
      ]
    })
    return disposer
  }, [])

  const findCurrentByName = useCallback(
    (name: string) => {
      return modalStack.find((item) => item.name === name)
    },
    [modalStack],
  )

  const getStack = useCallback(() => {
    return modalStack.concat()
  }, [modalStack])

  const disposeAll = useCallback(
    async (immediately = false) => {
      const reversedStack = modalStack.concat().reverse()
      if (immediately) {
        reversedStack.forEach((current) => current.disposer())
      } else {
        for (const current of reversedStack) {
          const instance = modalRefMap.current.get(current.component)

          if (!instance) {
            current.disposer()
            continue
          }
          await instance.dismiss()
          current.disposer()
        }
      }
    },
    [modalStack],
  )

  const isClient = useIsClient()

  return (
    <ModalStackContext.Provider
      value={{ present, findCurrentByName, getStack, disposeAll }}
    >
      {children}

      {isClient &&
        modalStack.map((comp, index) => {
          const { component: Component, id, disposer, overlayProps } = comp

          return (
            <OverLay
              childrenOutside
              show
              onClose={() => {
                const instance = modalRefMap.current.get(Component)

                if (!instance) {
                  disposer()
                } else {
                  instance.dismiss().then(() => {
                    disposer()
                  })
                }
              }}
              zIndex={60 + index}
              key={id}
              {...overlayProps}
            >
              {Component}
            </OverLay>
          )
        })}
    </ModalStackContext.Provider>
  )
}
