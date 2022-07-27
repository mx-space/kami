import { useRef } from 'react'

import { Input } from '~/components/universal/Input'

export const NotePasswordConfrim: React.FC<{
  onSubmit(password: string): any
}> = (props) => {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <div className="flex h-full w-full absolute items-center justify-center flex-col">
      <p>
        <strong className="font-medium text-2xl">此文章需要密码</strong>
      </p>
      <div className="space-x-3 text-center space-y-3">
        <Input ref={ref} type="password" />
        <button
          className="btn yellow flex-shrink-0"
          onClick={() => {
            if (!ref.current) {
              return
            }
            props.onSubmit(ref.current.value)
          }}
        >
          提交
        </button>
      </div>
    </div>
  )
}
