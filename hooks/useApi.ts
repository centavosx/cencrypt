import { AxiosResponse } from 'axios'
import { useState, useCallback, useEffect } from 'react'

/**
 * Use api hook
 * @param api - should be an axios instance
 * @returns
 */
export function useApi<Response extends any = any, Body extends any = any>(
  api: (options?: Body) => Promise<AxiosResponse<Response>>,
  isPost?: boolean
) {
  const [{ data, loading, isFetching, options, error }, setFetching] =
    useState<{
      data: Response | null
      loading: boolean
      isFetching: boolean
      error?: any
      options?: Body
    }>({ loading: !isPost, isFetching: false, data: null })

  const call = useCallback(
    async (body?: Body) => {
      if (loading) return
      let data: Response | null = null
      let error: any
      try {
        const response = await api(body)
        data = response.data
      } catch (e) {
        error = e
      } finally {
        setFetching((d) => ({ ...d, isFetching: false, data, error }))
      }
    },
    [api, loading]
  )

  const refetch = useCallback(
    (options?: Body) => {
      setFetching((v) => ({ ...v, loading: true, options }))
    },
    [setFetching]
  )

  useEffect(() => {
    if (isFetching && !loading) {
      call(options)
    }
  }, [loading, isFetching])

  useEffect(() => {
    if (loading) {
      setFetching((d) => ({
        ...d,
        loading: false,
        isFetching: true,
        error: undefined,
      }))
    }
  }, [isFetching, loading])

  return { data, isFetching, refetch, error }
}
