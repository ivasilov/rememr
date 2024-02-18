export const LoadingBookmark = () => {
  return (
    <div className="flex flex-row overflow-hidden rounded-md bg-white px-6 py-4 shadow">
      <div className="my-[18px] mr-5 w-5 animate-pulse bg-gray-300" />
      <div className="flex w-full flex-col">
        <div className="my-2 h-5 w-full max-w-md animate-pulse bg-gray-300 font-bold" />
        <span className="my-1 inline-block h-4 w-full max-w-[110px] animate-pulse bg-gray-300 font-normal" />
      </div>
    </div>
  )
}
