import { useRef } from 'react'

import { Input } from '@mx-space/kami-design/components/Input'

export const NotePasswordConfrim: React.FC<{
  onSubmit(password: string): any
}> = (props) => {
  const ref = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    if (!ref.current) {
      return
    }
    props.onSubmit(ref.current.value)
  }

  return (
    <div className="flex h-full w-full absolute items-center justify-center flex-col">
      <p>
        <strong className="font-medium text-2xl">此文章需要密码</strong>
      </p>
      <div className="space-x-3 text-center space-y-3 mt-4">
        <Input
          ref={ref}
          type="password"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit()
            }
          }}
        />
        <button className="btn yellow flex-shrink-0" onClick={handleSubmit}>
          提交
        </button>
      </div>
    </div>
  )
}
