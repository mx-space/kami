import type { FC } from 'react'
import { memo } from 'react'

import { MdiShare } from '~/components/ui/Icons/layout'
import { useGetHeaderShare } from '~/hooks/app/use-header-meta'

import {
  HeaderActionButton,
  HeaderActionButtonsContainer,
} from './HeaderActionButton'

export const HeaderActionShareButton: FC = () => {
  const hasShare = 'share' in navigator
  const shareData = useGetHeaderShare()
  return hasShare && shareData ? (
    <HeaderActionButtonsContainer>
      <HeaderActionButton>
        <HeaderActionButtonWithIcon
          onClick={() => {
            navigator
              .share(shareData!)
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              .then(() => {})
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              .catch(() => {})
          }}
          icon={<MdiShare />}
          title="分享"
        />
      </HeaderActionButton>
    </HeaderActionButtonsContainer>
  ) : null
}

export const HeaderActionButtonWithIcon: FC<{
  icon: JSX.Element
  title: string
  onClick: () => void
}> = memo(({ icon, title, onClick }) => {
  return (
    <div onClick={onClick} className="flex items-center justify-center">
      <span className="mr-2 inline-flex items-center">{icon}</span>

      <span className="flex-shrink-0">{title}</span>
    </div>
  )
})
