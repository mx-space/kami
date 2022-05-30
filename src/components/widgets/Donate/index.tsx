import type { FC, ReactNode } from 'react'
import React, { memo, useMemo } from 'react'

import { autoPlacement, offset, shift } from '@floating-ui/react-dom'

import { FloatPopover } from '~/components/universal/FloatPopover'
import { ImpressionView } from '~/components/universal/ImpressionView'
import { useThemeConfig } from '~/hooks/use-initial-data'

export const DonatePopover: FC<{ children: ReactNode }> = memo((props) => {
  const {
    function: {
      donate: { qrcode = [] },
    },
  } = useThemeConfig()
  const El = useMemo(() => <>{props.children}</>, [props.children])

  if (!qrcode.length) {
    return El
  }

  return (
    <FloatPopover
      wrapperClassNames="inline-flex items-center"
      middleware={[
        autoPlacement({
          autoAlignment: true,
        }),
        shift(),
        offset(10),
      ]}
      triggerComponent={() => El}
    >
      <ImpressionView trackerMessage="曝光 - 资助弹层">
        <div className="flex space-x-2">
          {qrcode.map((item) => (
            <img src={item} className="w-[300px]" />
          ))}
        </div>
      </ImpressionView>
    </FloatPopover>
  )
})
