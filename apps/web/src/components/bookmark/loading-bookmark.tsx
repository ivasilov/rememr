import { Card } from '@rememr/ui'

export const LoadingBookmark = () => {
  return (
    <Card className="group flex overflow-hidden px-6 py-4">
      <div className="my-3 mr-5 h-5 w-5 animate-pulse bg-gray-300" />
      <div className="flex w-full justify-between">
        <div className="flex grow flex-col gap-y-3">
          <div className="h-5 w-full max-w-md animate-pulse bg-gray-300" />
          <span className="inline-block h-4 w-full max-w-[110px] animate-pulse bg-gray-300 " />
        </div>
      </div>
    </Card>
  )
}
