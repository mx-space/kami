import { MdiShare } from 'components/universal/Icons'
import { observer } from 'mobx-react-lite'
import React, { FC, memo } from 'react'
import { useStore } from 'store'
import {
  HeaderActionButton,
  HeaderActionButtonsContainer,
} from './HeaderActionButton'

export const HeaderActionShareButton: FC = observer(() => {
  const { appUIStore } = useStore()
  const hasShare = 'share' in navigator
  return hasShare && appUIStore.shareData ? (
    <HeaderActionButtonsContainer>
      <HeaderActionButton>
        <HeaderActionButtonWithIcon
          onClick={() => {
            navigator
              .share(appUIStore.shareData!)
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              .then(() => {})
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              .catch(() => {})
          }}
          icon={<MdiShare />}
          title={'分享'}
        />
      </HeaderActionButton>
    </HeaderActionButtonsContainer>
  ) : null
})

export const HeaderActionButtonWithIcon: FC<{
  icon: JSX.Element
  title: string
  onClick: () => void
}> = memo(({ icon, title, onClick }) => {
  return (
    <div onClick={onClick} className="flex items-center justify-center">
      <span className="inline-flex items-center mr-2">{icon}</span>

      <span className="flex-shrink-0">{title}</span>
    </div>
  )
})
