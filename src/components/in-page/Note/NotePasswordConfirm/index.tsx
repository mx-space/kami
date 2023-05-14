import { useRef } from 'react'

import { Input } from '~/components/ui/Input'

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
    <div className="absolute flex h-full w-full flex-col items-center justify-center">
      <p>
        <strong className="text-2xl font-medium">此文章需要密码</strong>
      </p>
      <div className="mt-4 space-x-3 space-y-3 text-center">
        <Input
          ref={ref}
          type="password"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit()
            }
          }}
        />
        <button
          className="btn !bg-primary flex-shrink-0 !text-white"
          onClick={handleSubmit}
        >
          提交
        </button>
      </div>
    </div>
  )
}
