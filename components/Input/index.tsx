import classNames from 'classnames'
import {
  createElement,
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import styles from './index.module.scss'

interface InputProps {
  prefix?: JSX.Element
  multi?: boolean
}

export const Input: FC<
  Omit<
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
> = (props) => {
  // const [value, setValue] = useState(props.value)
  const { prefix, value, onChange, multi = false, ...rest } = props
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

    const size = {
      height: $input.clientHeight,
      width: $input.clientWidth,
    }
    setSize(size)
  }, [inputWrapRef])
  const I = (multi ? 'textarea' : 'input') as keyof JSX.IntrinsicElements
  return (
    <span
      className={classNames(
        styles['input-wrap'],
        focused ? styles['focus'] : undefined,
      )}
      ref={inputWrapRef}
    >
      {prefix && <div className={styles['prefix-wrap']}>{prefix}</div>}
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
      <I
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
    </span>
  )
}
