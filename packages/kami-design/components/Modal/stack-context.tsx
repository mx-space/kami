import { clsx } from 'clsx'
import uniqueId from 'lodash-es/uniqueId'
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
  memo,
  useContext,
  useRef,
  useState,
} from 'react'
import { useStateToRef } from 'react-shortcut-guide'

import { useIsClient } from '~/hooks/use-is-client'

import type { OverlayProps } from '../Overlay'
import { Overlay } from '../Overlay'
import type { ModalProps, ModalRefObject } from './Modal'
import { Modal } from './Modal'

/**
 * @param {boolean} immediately 立即销毁，不会等待动画结束
 */
type Disposer = (immediately?: boolean) => void

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
   * 传递组件的 props, 可以是一个函数，如果是函数，则会在 Modal 出现的时候调用获取 props
   */
  props?: T | (() => T)
  /**
   * 传递 Modal 的 Props
   */
  modalProps?: ModalProps
}

interface UniversalProps {
  overlayProps?: Partial<OverlayProps>
  /**
   * Only used by find stack
   */
  name?: string
  /**
   * 在移动端视图 使用底部 Drawer 样式
   * @default true
   */
  useBottomDrawerInMobile?: boolean
}

interface IModalStackStateType extends UniversalProps {
  component: FunctionComponentElement<any>
  id: string
  disposer: Disposer
}

export const ModalStackProvider: FC<{
  isMobileSize: boolean
  children?: ReactNode | ReactChildren
}> = memo((props) => {
  const { children, isMobileSize } = props
  const [modalStack, setModalStack] = useState<IModalStackStateType[]>([])
  const modalStackRef = useStateToRef(modalStack)

  const [extraModalPropsMap, setExtraModalPropsMap] = useState<
    Map<
      string,
      {
        overlayShow: boolean
      }
    >
  >(new Map())

  const modalRefMap = useRef(
    new WeakMap<FunctionComponentElement<any>, ModalRefObject>(),
  )

  const dismissFnMapRef = useRef(
    new WeakMap<FunctionComponentElement<any>, () => any>(),
  )

  const present = useRef((comp: IModalStackComponent): Disposer => {
    const {
      component,
      props,
      modalProps,
      useBottomDrawerInMobile = true,
      ...rest
    } = comp

    const id = uniqueId('modal-stack-')

    let modalChildren: ReactChildren | ReactNode[] | ReactNode
    if (React.isValidElement(component)) {
      modalChildren = component
      // JSX
    } else if (typeof component === 'function') {
      // React.FC
      modalChildren = createElement(
        component as any,
        typeof props === 'function' ? props() : props,
      )
    } else {
      console.error(
        'ModalStackProvider: component must be ReactElement or React.FC',
      )
      return () => null
    }

    const disposer = (immediately = false) => {
      const immediatelyDisposer = () => {
        setModalStack((stack) => {
          return stack.filter((item) => item.id !== id)
        })
      }
      if (immediately) {
        immediatelyDisposer()
      } else {
        const fn = dismissFnMapRef.current.get($modalElement)
        if (!fn) {
          immediatelyDisposer()
          return
        }
        fn()
      }
    }

    const $modalElement: FunctionComponentElement<any> = createElement(
      Modal,
      {
        ...modalProps,
        modalId: id,
        useBottomDrawerInMobile,
        key: id,
        ref: (ins) => {
          modalRefMap.current.set($modalElement, ins!)
        },
        disposer,
      },
      modalChildren,
    )

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

    setExtraModalPropsMap((map) => {
      map.set(id, {
        overlayShow: true,
      })
      return new Map(map)
    })
    return disposer
  }).current

  const findCurrentByName = useRef((name: string) => {
    const modalStack = modalStackRef.current
    return modalStack.find((item) => item.name === name || item.id === name)
  }).current

  const getStack = useRef(() => {
    const modalStack = modalStackRef.current
    return modalStack.concat()
  }).current

  const disposeAll = useRef(async (immediately = false) => {
    const modalStack = modalStackRef.current
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
  }).current

  const isClient = useIsClient()

  return (
    <ModalStackContext.Provider
      value={
        useRef({ present, findCurrentByName, getStack, disposeAll }).current
      }
    >
      {children}

      {isClient &&
        modalStack.map((comp, index) => {
          const {
            component: Component,
            id,
            disposer,
            overlayProps,
            useBottomDrawerInMobile = true,
          } = comp
          const extraProps = extraModalPropsMap.get(id)!

          const onClose = () => {
            const instance = modalRefMap.current.get(Component)

            if (!instance) {
              disposer(true)
            } else {
              const dismissTask = instance.dismiss()

              setExtraModalPropsMap((map) => {
                map.set(id, {
                  ...extraProps,
                  overlayShow: false,
                })
                return new Map(map)
              })

              dismissTask.then(() => {
                disposer(true)
                extraModalPropsMap.delete(id)
              })
            }
          }

          dismissFnMapRef.current.set(Component, onClose)
          return (
            <Overlay
              center={!isMobileSize && useBottomDrawerInMobile}
              standaloneWrapperClassName={clsx(
                isMobileSize &&
                  useBottomDrawerInMobile &&
                  'items-end justify-center',
              )}
              show={extraProps.overlayShow}
              onClose={() => disposer()}
              zIndex={60 + index}
              key={id}
              {...overlayProps}
            >
              {Component}
            </Overlay>
          )
        })}
    </ModalStackContext.Provider>
  )
})
