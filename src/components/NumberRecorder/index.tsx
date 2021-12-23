import { FC, useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'

interface NumberRecorderProps {
  number: number
}

const NumberRecorder: FC<NumberRecorderProps> = (props) => {
  const { number } = props
  const [n, setN] = useState(number)
  const numbersRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!numbersRef.current || n === number) {
      return
    }

    const animate = numbersRef.current.animate(
      [
        {
          transform: 'translateY(-1em)',
        },
        {
          transform: `translateY(${number === n + 1 ? -2 : 0}em)`,
        },
      ],
      { duration: 500, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    )

    animate.onfinish = () => {
      setN(number)
    }
  }, [n, number])

  return (
    <div
      className={styles['recorder']}
      style={{ width: `${n.toString().length}em` }}
    >
      <div className={styles['numbers']} ref={numbersRef}>
        {n - 1 < 0 ? <span>0</span> : <span>{n - 1}</span>}
        <span>{n}</span>
        <span>{n + 1}</span>
      </div>
    </div>
  )
}

export { NumberRecorder }
