import type { FC, ReactNode } from 'react'
import React, { useMemo } from 'react'

import { autoPlacement, offset, shift } from '@floating-ui/react-dom'

import { withNoSSR } from '~/components/app/HoC/no-ssr'
import { ImpressionView } from '~/components/common/ImpressionView'
import { FloatPopover } from '~/components/ui/FloatPopover'
import { useThemeConfig } from '~/hooks/app/use-initial-data'

export const DonatePopover: FC<{ children: ReactNode }> = withNoSSR((props) => {
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
            <img src={item} className="w-[300px]" key={item} />
          ))}
        </div>
      </ImpressionView>
    </FloatPopover>
  )
})
