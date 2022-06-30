import { uniqueId } from 'lodash-es'
import type { FC, ReactChildren, ReactElement, ReactNode } from 'react'
import React, {
  createContext,
  createElement,
  useCallback,
  useContext,
  useState,
} from 'react'

import { useIsClient } from '~/hooks/use-is-client'

import { Modal } from '.'
import { OverLay } from '../Overlay'

type Disposer = () => void

export type ModalStackContextType = {
  popup: (comp: IModalStackComponent) => Disposer
}

const ModalStackContext = createContext<ModalStackContextType>({
  popup: () => () => void 0,
})

export const useModalStack = () => useContext(ModalStackContext)

export interface IModalStackComponent {
  component: ReactNode | ReactElement | React.FC
  props?: any
  modalProps?: any
}

interface IModalStackStateType {
  component: ReactNode
  id: string
  disposer: Disposer
}

export const ModalStackProvider: FC<{
  children?: ReactNode | ReactChildren
}> = (props) => {
  const { children } = props
  const [modalStack, setModalStack] = useState<IModalStackStateType[]>([])

  const popup = useCallback((comp: IModalStackComponent) => {
    const { component, props, modalProps } = comp

    const id = uniqueId('modal-stack-')
    const disposer = () => {
      setModalStack((stack) => {
        return stack.filter((item) => item.id !== id)
      })
    }

    let $modalElement: ReactNode
    if (React.isValidElement(component)) {
      $modalElement = createElement(Modal, modalProps, component)

      // JSX
    } else if (typeof component === 'function') {
      // React.FC

      $modalElement = createElement(
        Modal,
        modalProps,
        createElement(component as any, props),
      )
    } else {
      $modalElement = null

      console.error(
        'ModalStackProvider: component must be ReactElement or React.FC',
      )
    }

    setModalStack((stack) => {
      return [
        ...stack,
        {
          component: $modalElement,
          id,
          disposer,
        },
      ]
    })
    return disposer
  }, [])

  const isClient = useIsClient()

  return (
    <ModalStackContext.Provider value={{ popup }}>
      {children}

      {isClient &&
        modalStack.map((comp, index) => {
          const { component: Component, id, disposer } = comp

          return (
            <OverLay
              childrenOutside
              show
              onClose={disposer}
              zIndex={60 + index}
              key={id}
            >
              {Component}
            </OverLay>
          )
        })}
    </ModalStackContext.Provider>
  )
}
