import { uniqueId } from 'lodash-es'
import type { FC, ReactChildren, ReactElement, ReactNode } from 'react'
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
  popup: (comp: IModalStackComponent) => Disposer
}

const ModalStackContext = createContext<ModalStackContextType>({
  popup: () => () => void 0,
})

export const useModalStack = () => useContext(ModalStackContext)

export interface IModalStackComponent extends UniversalProps {
  component: ReactNode | ReactElement | React.FC
  props?: any
  modalProps?: ModalProps
}

interface UniversalProps {
  overlayProps?: OverlayProps
}

interface IModalStackStateType extends UniversalProps {
  component: ReactNode
  id: string
  disposer: Disposer
}

export const ModalStackProvider: FC<{
  children?: ReactNode | ReactChildren
}> = (props) => {
  const { children } = props
  const [modalStack, setModalStack] = useState<IModalStackStateType[]>([])

  const modalRefMap = useRef(new Map<string, ModalRefObject>())

  const popup = useCallback((comp: IModalStackComponent) => {
    const { component, props, modalProps, ...rest } = comp

    const id = uniqueId('modal-stack-')
    const disposer = () => {
      setModalStack((stack) => {
        return stack.filter((item) => item.id !== id)
      })
    }

    let $modalElement: ReactNode
    if (React.isValidElement(component)) {
      $modalElement = createElement(
        Modal,
        {
          ...modalProps,
          ref: (ins) => {
            modalRefMap.current.set(id, ins!)
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
            modalRefMap.current.set(id, ins!)
          },
        },
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
          ...rest,
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
          const { component: Component, id, disposer, overlayProps } = comp

          return (
            <OverLay
              childrenOutside
              show
              // TODO dispose when transition end
              // onClose={disposer}
              onClose={() => {
                modalRefMap.current
                  .get(id)!
                  .dismiss()
                  .then(() => {
                    disposer()
                  })
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
