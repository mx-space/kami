import { clsx as classNames } from 'clsx'
import type {
  DetailedHTMLProps,
  ForwardedRef,
  HTMLAttributes,
  InputHTMLAttributes,
} from 'react'
import React, {
  createContext,
  forwardRef,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import styles from './index.module.css'

interface InputProps {
  prefix?: JSX.Element
  multi?: boolean
  wrapperProps?: DetailedHTMLProps<
    HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >
}
type IInputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'prefix'
> &
  InputProps &
  Omit<
    DetailedHTMLProps<
      InputHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >,
    'prefix'
  >

export const InputContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setFocus(_state: boolean) {},
})
export const Input = memo(
  forwardRef<HTMLInputElement | HTMLTextAreaElement, IInputProps>(
    (props, ref) => {
      // const [value, setValue] = useState(props.value)
      const {
        prefix,
        value,
        onChange,
        multi = false,
        wrapperProps,
        ...rest
      } = props
      const [focused, setFocus] = useState(false)
      const inputWrapRef = useRef<HTMLSpanElement>(null)
      const [size, setSize] = useState({
        height: 0,
        width: 0,
      })
      const C = useMemo(() => (size.height + size.width) * 2, [size])
      useEffect(() => {
        if (!inputWrapRef.current) {
          return
        }
        const $input = inputWrapRef.current

        const resizeObserver = new ResizeObserver((entries) => {
          // const size = {
          //   height: entries[0].borderBoxSize[0].blockSize,
          //   width: entries[0].borderBoxSize[0].inlineSize,
          // }
          const $target = entries[0].target
          const size = {
            height: $target.clientHeight,
            width: $target.clientWidth,
          }
          setSize(size)
        })
        resizeObserver.observe($input)

        return () => {
          resizeObserver.unobserve($input)
          resizeObserver.disconnect()
        }
      }, [inputWrapRef])

      const inputContextProviderValue = useRef({
        setFocus: (state: boolean) => {
          setFocus(state)
        },
      })

      return (
        <span
          {...props.wrapperProps}
          className={classNames(styles['input-wrap'], wrapperProps?.className)}
          ref={inputWrapRef}
        >
          {prefix && <div className={styles['prefix-wrap']}>{prefix}</div>}
          {typeof C === 'number' && !!C && (
            <div className={styles['border']}>
              <svg>
                <rect
                  height={size.height}
                  width={size.width}
                  // x={1}
                  // y={0}
                  style={{
                    strokeDasharray: `${C}px`,
                    strokeDashoffset: !focused ? `${C}px` : undefined,
                    // '--C': `${C}px`,
                  }}
                  className={styles['rect']}
                />
              </svg>
            </div>
          )}
          {props.children ? (
            <InputContext.Provider value={inputContextProviderValue.current}>
              {props.children}
            </InputContext.Provider>
          ) : multi ? (
            <textarea
              ref={ref as ForwardedRef<HTMLTextAreaElement>}
              value={value}
              {...rest}
              onFocus={(e) => {
                setFocus(true)
                props.onFocus?.(e)
              }}
              onBlur={(e) => {
                setFocus(false)
                props.onBlur?.(e)
              }}
              // @ts-ignore
              onChange={onChange}
              className={classNames(
                styles['input'],
                prefix ? styles['has-prefix'] : null,
                rest.className,
              )}
            />
          ) : (
            <input
              ref={ref as ForwardedRef<HTMLInputElement>}
              value={value}
              {...rest}
              onFocus={(e) => {
                setFocus(true)
                props.onFocus?.(e)
              }}
              onBlur={(e) => {
                setFocus(false)
                props.onBlur?.(e)
              }}
              // @ts-ignore
              onChange={onChange}
              className={classNames(
                styles['input'],
                prefix ? styles['has-prefix'] : null,
                rest.className,
              )}
            />
          )}
        </span>
      )
    },
  ),
)
