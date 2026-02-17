import type { FC } from 'react'
import { memo, useCallback, useRef, useState } from 'react'

import { Input } from '~/components/ui/Input'
import { apiClient } from '~/utils/client'

export const RecentlySendBox: FC = memo(() => {
  const [content, setText] = useState('')

  const taRef = useRef<HTMLTextAreaElement>(null)
  const handleSubmit = useCallback(() => {
    apiClient.shorthand.proxy.post({ data: { content } }).then(() => {
      setText('')
      if (taRef.current) taRef.current.value = ''
    })
  }, [content])
  return (
    <form
      action="#"
      onSubmit={useCallback(
        (e) => {
          e.preventDefault()
          handleSubmit()
        },
        [handleSubmit],
      )}
    >
      <Input
        multi
        // @ts-ignore
        ref={taRef}
        // @ts-ignore
        rows={4}
        required
        onChange={(e) => {
          setText(e.target.value)
        }}
        autoFocus={true}
        placeholder="今天遇到了什么烦心事？"
      />
      <div className="mt-3 text-right">
        <button
          className="btn !bg-primary !text-white"
          onClick={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          disabled={content.trim().length === 0}
        >
          发送
        </button>
      </div>
    </form>
  )
})
