import { TrackerAction } from 'constants/tracker'
import { useAnalyze } from 'hooks/use-analyze'
import type { FC } from 'react'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'

export const ImpressionView: FC<{
  trackerMessage?: string
  action?: TrackerAction
}> = (props) => {
  const [impression, setImpression] = useState(false)
  const { event } = useAnalyze()
  const { ref } = useInView({
    initialInView: false,
    triggerOnce: true,
    onChange(inView) {
      if (inView) {
        setImpression(true)
        event({
          action: props.action ?? TrackerAction.Impression,
          label: props.trackerMessage,
        })
      }
    },
  })

  return (
    <>
      {props.children}
      {!impression && <div ref={ref}></div>}
    </>
  )
}
