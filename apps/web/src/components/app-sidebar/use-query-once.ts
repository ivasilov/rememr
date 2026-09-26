import { queryOnce } from '@supabase-labs/tanstack-db'
import type {
  ExtractContext,
  InferResultType,
  InitialQueryBuilder,
  QueryBuilder,
} from '@tanstack/db'
import type { DependencyList } from 'react'
import { useEffect, useRef, useState } from 'react'

export const useQueryOnce = <
  TQueryFn extends (query: InitialQueryBuilder) => QueryBuilder<any>,
  TQuery extends QueryBuilder<any> = ReturnType<TQueryFn>,
>(
  query: TQueryFn,
  deps: DependencyList = []
) => {
  type Result = InferResultType<ExtractContext<TQuery>>

  const queryRef = useRef(query)
  queryRef.current = query

  const [data, setData] = useState<Result>()
  const [error, setError] = useState<unknown>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCurrent = true
    setIsLoading(true)
    setError(undefined)

    queryOnce(queryRef.current)
      .then((result) => {
        if (isCurrent) {
          setData(result as Result)
        }
      })
      .catch((queryError: unknown) => {
        if (isCurrent) {
          setError(queryError)
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [...deps])

  return { data, error, isLoading }
}
