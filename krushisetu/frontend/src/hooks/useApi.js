import { useState, useEffect, useCallback } from 'react'

/**
 * useApi — generic data-fetching hook
 * @param {Function} fetchFn  - async function that returns { data }
 * @param {Array}    deps     - dependency array for re-fetching
 * @param {Boolean}  immediate - fetch on mount (default true)
 */
export function useApi(fetchFn, deps = [], immediate = true) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn(...args)
      setData(result.data)
      return result.data
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => {
    if (immediate) execute()
  }, [execute])

  return { data, loading, error, refetch: execute }
}

/**
 * useMutation — for POST/PUT/DELETE operations
 * @param {Function} mutateFn - async mutation function
 */
export function useMutation(mutateFn) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const mutate = async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await mutateFn(...args)
      return result.data
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Something went wrong'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}
