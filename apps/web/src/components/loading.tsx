import { Loader2 } from 'lucide-react'
import { memo } from 'react'

const Loading = memo(({ size = 72 }: { size?: number }) => {
  return (
    <div className="flex h-full grow">
      <div className="mx-auto self-center">
        <Loader2 className="animate-spin" size={size} />
      </div>
    </div>
  )
})

Loading.displayName = 'Loading'

export { Loading }
