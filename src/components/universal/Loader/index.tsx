import type { FC } from 'react'
import { memo, useRef } from 'react'

import { CustomLogo } from '~/components/universal/Logo'

export const Loader: FC = memo(() => {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <>
      {/*  @ts-ignore */}
      <style jsx global>
        {`
          .loader-logo {
            top: 50%;
            left: 50%;
            opacity: 1;
            z-index: 100;
            height: 8em;
            color: #fff !important;
            position: fixed;
            transform: translate(-50%, -50%);
            transition: none !important;
            perspective: 1500px;
          }
          .loader-logo .animation {
            animation: zoom-in 1s ease-out backwards;
            position: relative;
            z-index: 999;
            transform: translate3d(0, 0, 0);
            will-change: transform;
          }
          .loader:before {
            top: 50%;
            pointer-events: none;
            left: 50%;
            z-index: 99;
            content: '';
            width: 100vmax;
            height: 100vmax;
            position: fixed;
            border-radius: 50%;
            background: var(--green);
            transform: translate(-50%, -50%) scale(1.5);
            animation: fade-out 1s ease-out;
          }
          body.loading .loader:before {
            pointer-events: all;
            opacity: 1;
            transition: opacity 0.2s;
            animation: none;
          }
          body.loading .loader-logo {
            transform: translate(-50%, -50%) scale(1);
            transition: transform 0.8s cubic-bezier(0.5, 0, 0.5, 1.5);
          }
          body.loading .loader-logo .animation {
            animation: none;
          }
          @keyframes zoom-in {
            50% {
              transform: translate3d(0, 0, -300px);
              opacity: 1;
            }
            80% {
              opacity: 1;
            }
            to {
              transform: translate3d(0, 0, 1500px);
              opacity: 0;
            }
          }
          @keyframes fade-out {
            30% {
              opacity: 1;
            }
            60% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }
        `}
      </style>
      <div className="loader" ref={ref} />
      <div className="loader-logo">
        <CustomLogo
          className="animation"
          height="150px"
          onAnimationEnd={(e) => {
            ref.current?.remove()
            ;(e.target as any)?.remove()
          }}
        />
      </div>
    </>
  )
})
