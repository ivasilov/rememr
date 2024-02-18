import { Spinner } from './spinner'

export const Loading = () => {
  return (
    <div className="flex h-full grow">
      <div className="mx-auto self-center">
        <Spinner size="3x" />
      </div>
    </div>
  )
}
