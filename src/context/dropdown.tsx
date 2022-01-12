/*
 * @Author: Innei
 * @Date: 2021-02-04 13:27:29
 * @LastEditTime: 2021-02-05 15:50:05
 * @LastEditors: Innei
 * @FilePath: /web/common/context/dropdown.tsx
 * @Mark: Coding with Love
 */
import { DropDown, DropDownProps } from 'components/universal/Dropdown'
import { useRouter } from 'next/router'
import RcQueueAnim from 'rc-queue-anim'
import {
  createContext,
  FC,
  Fragment,
  memo,
  useContext,
  useEffect,
  useState,
} from 'react'

export type DisposerMethodsType = {
  disposer: Function
  wantToDisposer: Function
}
export const DropdownContext = createContext<
  {
    present(el: JSX.Element, option: Partial<OptionType>): DisposerMethodsType
  } & DisposerMethodsType
>({
  present() {
    return { disposer() {}, wantToDisposer() {} }
  },
  disposer() {},
  wantToDisposer() {},
})

export const useDropdown = () => useContext(DropdownContext)
export type OptionType = Pick<DropDownProps, 'x' | 'y' | 'width'> & {
  id: string | number
  autoHideDuration?: false | number
}

let timer
export const DropdownProvider: FC = memo((props) => {
  const [el, setEl] = useState<JSX.Element | null>(null)
  const [option, setOption] = useState<OptionType>({
    x: 0,
    y: 0,
    width: 200,
    id: 'drop',
  })
  const [active, setActive] = useState(false)

  useEffect(() => {
    // setActive(false)
    timer = clearTimeout(timer)
  }, [el])
  useEffect(() => {
    if (active) {
      timer = clearTimeout(timer)
      setActive(false)
    }
  }, [active])
  useEffect(() => {
    if (
      option.autoHideDuration &&
      typeof option.autoHideDuration === 'number' &&
      !timer
    ) {
      timer = setTimeout(() => {
        setEl(null)
      }, option.autoHideDuration)
    }
  }, [option, el])

  const router = useRouter()
  useEffect(() => {
    const handler = () => {
      setEl(null)
    }
    router.events.on('routeChangeStart', handler)

    return () => {
      router.events.off('routeChangeStart', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])
  const disposer = () => setEl(null)

  const disposerMethods: DisposerMethodsType = {
    disposer() {
      return disposer()
    },

    wantToDisposer() {
      if (active) {
        return
      } else {
        disposer()
      }
    },
  }

  return (
    <Fragment>
      <RcQueueAnim type={'bottom'}>
        {el ? (
          <DropDown
            onLeave={disposer}
            onEnter={() => {
              setActive(true)
            }}
            {...option}
            key={option.id}
          >
            {el}
          </DropDown>
        ) : null}
      </RcQueueAnim>
      <DropdownContext.Provider
        value={{
          present(el, op) {
            setEl(el)

            // @ts-ignore
            setOption(op)

            return disposerMethods
          },
          ...disposerMethods,
        }}
      >
        {props.children}
      </DropdownContext.Provider>
    </Fragment>
  )
})
