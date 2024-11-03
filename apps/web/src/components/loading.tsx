import { Loader2 } from 'lucide-react'
import { memo } from 'react'

const Loading = memo(() => {
  return (
    <div className="flex h-full grow">
      <div className="mx-auto self-center">
        <Loader2 className="animate-spin" size={72} />
      </div>
    </div>
  )
})

Loading.displayName = 'Loading'

export { Loading }
