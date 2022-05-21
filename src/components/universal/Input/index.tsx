import classNames from 'clsx'
import merge from 'lodash-es/merge'
import type {
  DetailedHTMLProps,
  ForwardedRef,
  HTMLAttributes,
  InputHTMLAttributes,
} from 'react'
import {
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
  setFocus(state: boolean) {},
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
        requestAnimationFrame(() => {
          if (!inputWrapRef.current) {
            return
          }
          const $input = inputWrapRef.current

          const size = {
            height: $input.clientHeight,
            width: $input.clientWidth,
          }
          setSize(size)
        })
      }, [inputWrapRef])

      return (
        <span
          {...merge(props.wrapperProps, {
            className: classNames(
              styles['input-wrap'],

              wrapperProps?.className,
            ),
          })}
          // className={classNames(
          //   styles['input-wrap'],
          //   focused ? styles['focus'] : undefined,
          // )}
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
                ></rect>
              </svg>
            </div>
          )}
          {props.children ? (
            <InputContext.Provider
              value={{
                setFocus: (state: boolean) => {
                  setFocus(state)
                },
              }}
            >
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
              )}
            />
          )}
        </span>
      )
    },
  ),
)
