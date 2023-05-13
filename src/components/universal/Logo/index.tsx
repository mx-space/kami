import type { FC } from 'react'
import { memo } from 'react'

import { useKamiConfig } from '~/hooks/app/use-initial-data'

export const DefaultLogo: FC<JSX.IntrinsicElements['svg']> = memo((props) => {
  return (
    <svg viewBox="0 0 200 200" version="1.1" {...props}>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Group" transform="translate(1.000000, 0.000000)">
          <g transform="translate(0.891670, 0.001664)" fillRule="nonzero">
            <g id="Shape-2" fill="currentColor">
              <path
                d="M97.9232558,0 C43.8413297,0 0,43.8413297 0,97.9232558 C0,152.005182 43.8413297,195.846512 97.9232558,195.846512 C152.005182,195.846512 195.846512,152.005182 195.846512,97.9232558 C195.846512,43.8413297 152.005182,0 97.9232558,0 Z M97.9232558,184.96615 C49.8516415,184.96615 10.8803618,145.99487 10.8803618,97.9232558 C10.8803618,49.8516415 49.8516415,10.8803618 97.9232558,10.8803618 C145.99487,10.8803618 184.96615,49.8516415 184.96615,97.9232558 C184.96615,145.99487 145.99487,184.96615 97.9232558,184.96615 Z"
                id="Shape"
              />
            </g>
            <circle id="Oval" cx="97.9232558" cy="97.9232558" r="78.8162791" />
          </g>
          <g
            transform="translate(48.391670, 47.501664)"
            id="Shape"
            stroke="currentColor"
            strokeWidth="8.8"
          >
            <path d="M50.1120234,100.116279 L0,50.1120234 L50.1120234,0 L100.116279,50.0042556 L50.1120234,100.116279 Z M90.5813953,57.2093023 L72.7145681,40.3711034 L50.1119553,19.0697674 L9.53488372,57.2093023 M71.5116279,42.9069767 L33.372093,81.0465116 M28.6046512,42.9069767 L66.744186,81.0465116" />
          </g>
        </g>
      </g>
    </svg>
  )
})

export const CustomLogo: FC<JSX.IntrinsicElements['svg']> = memo((props) => {
  const {
    site: { logoSvg },
  } = useKamiConfig()
  // FIXME: div props
  const { className, height, onAnimationEnd } = props
  if (logoSvg) {
    return (
      <div
        className={className}
        style={{ height }}
        // @ts-ignore
        onAnimationEnd={onAnimationEnd}
        dangerouslySetInnerHTML={{
          __html: logoSvg,
        }}
      />
    )
  }
  return <DefaultLogo {...props} />
})
