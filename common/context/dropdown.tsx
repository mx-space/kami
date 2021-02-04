/*
 * @Author: Innei
 * @Date: 2021-02-04 13:27:29
 * @LastEditTime: 2021-02-04 14:36:41
 * @LastEditors: Innei
 * @FilePath: /web/common/context/dropdown.tsx
 * @Mark: Coding with Love
 */
import { DropDown, DropDownProps } from 'components/Dropdown'
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

export const DropdownContext = createContext<{
  present(el: JSX.Element, option: Partial<OptionType>): void
}>({
  present() {},
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
    setActive(false)
  }, [el])
  useEffect(() => {
    if (active) {
      timer = clearTimeout(timer)
    }
  }, [active])
  useEffect(() => {
    if (
      option.autoHideDuration &&
      typeof option.autoHideDuration === 'number'
    ) {
      timer = setTimeout(() => {
        setEl(null)
      }, option.autoHideDuration)
    }
    return () => {
      timer = clearTimeout(timer)
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
  return (
    <Fragment>
      <RcQueueAnim type={'top'}>
        {el ? (
          <DropDown
            onLeave={disposer}
            onEnter={() => setActive(true)}
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
          },
        }}
      >
        {props.children}
      </DropdownContext.Provider>
    </Fragment>
  )
})
