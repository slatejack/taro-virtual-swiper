import { useRef, useCallback } from 'react'

/**
 * 防抖 Hook
 */
export function useDebounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): T {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        fn(...args)
      }, delay)
    },
    [fn, delay]
  ) as T

  return debouncedFn
}

/**
 * 节流 Hook
 */
export function useThrottle<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): T {
  const lastTimeRef = useRef(0)

  const throttledFn = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastTimeRef.current >= delay) {
        lastTimeRef.current = now
        fn(...args)
      }
    },
    [fn, delay]
  ) as T

  return throttledFn
}

/**
 * 获取边界值
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
