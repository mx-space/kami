import { CustomLogo } from 'components/Logo'
import { FC, memo } from 'react'

const Loader: FC = memo(() => {
  return (
    <div className={'loader'}>
      <style jsx global>{`
        .loader svg {
          top: 50%;
          left: 50%;
          opacity: 0;
          z-index: 100;
          height: 8em;
          color: #fff;
          position: fixed;
          visibility: hidden;
          transform: translate(-50%, -50%) scale(0);
          transition: opacity 0.3s,
            transform 0.5s cubic-bezier(0.5, 0, 0.5, 1.5), visibility 0.3s;
        }
        .loader:before {
          top: 50%;
          left: 50%;
          z-index: 99;
          content: '';
          width: 100vmax;
          height: 100vmax;
          position: fixed;
          border-radius: 50%;
          background: var(--green);
          transition: transform 0.5s ease-in-out;
          transform: translate(-50%, -50%) scale(0);
        }
        body.loading .loader:before {
          transform: translate(-50%, -50%) scale(1.5);
        }
        body.loading .loader svg {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, -50%) scale(1);
        }
      `}</style>
      <CustomLogo />
    </div>
  )
})

export default Loader
