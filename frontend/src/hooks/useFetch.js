import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for standard asynchronous data fetching
 * @param {Function} fetcherFn - Asynchronous function returning data
 * @param {Array} deps - Dependency array to trigger refetch
 */
export function useFetch(fetcherFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const execute = useCallback(async () => {
    let isMounted = true
    setLoading(true)
    setError(null)
    try {
      const result = await fetcherFn()
      if (isMounted) {
        setData(result)
      }
    } catch (err) {
      if (isMounted) {
        setError(err.message || 'Failed to load data')
      }
    } finally {
      if (isMounted) {
        setLoading(false)
      }
    }
    return () => {
      isMounted = false
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    execute()
  }, [execute])

  return { data, loading, error, refetch: execute }
}
