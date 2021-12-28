import { faShare, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { appUIStore } from 'common/store'
import { observer } from 'mobx-react-lite'
import React, { FC, memo } from 'react'
import {
  HeaderActionButton,
  HeaderActionButtonsContainer,
} from './HeaderActionButton'

export const HeaderActionShareButton: FC = observer(() => {
  const hasShare = 'share' in navigator
  return hasShare && appUIStore.shareData ? (
    <HeaderActionButtonsContainer>
      <HeaderActionButton style={{ height: '2.5rem', width: '5rem' }}>
        <HeaderActionButtonWithIcon
          onClick={() => {
            navigator
              .share(appUIStore.shareData!)
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              .then(() => {})
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              .catch(() => {})
          }}
          icon={faShare}
          title={'分享'}
        />
      </HeaderActionButton>
    </HeaderActionButtonsContainer>
  ) : null
})

export const HeaderActionButtonWithIcon: FC<{
  icon: IconDefinition
  title: string
  onClick: () => void
}> = memo(({ icon, title, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-center text-shizuku-text text-opacity-95"
    >
      <FontAwesomeIcon icon={icon} className={'mr-2'} />

      <span className="flex-shrink-0">{title}</span>
    </div>
  )
})
