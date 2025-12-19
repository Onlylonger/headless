import { useState, useCallback } from 'react';
import type { UseCounterReturn } from './types';

export interface UseCounterOptions {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * A headless hook for managing counter state
 *
 * @param options - Configuration options for the counter
 * @returns A tuple containing [count, actions]
 *
 * @example
 * ```tsx
 * const [count, { increment, decrement, reset }] = useCounter({
 *   initialValue: 0,
 *   min: 0,
 *   max: 10,
 *   step: 1
 * });
 * ```
 */
export function useCounter(options: UseCounterOptions = {}): UseCounterReturn {
  const {
    initialValue = 0,
    min,
    max,
    step = 1,
  } = options;

  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => {
      const next = prev + step;
      return max !== undefined ? Math.min(next, max) : next;
    });
  }, [step, max]);

  const decrement = useCallback(() => {
    setCount((prev) => {
      const next = prev - step;
      return min !== undefined ? Math.max(next, min) : next;
    });
  }, [step, min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback((value: number) => {
    let next = value;
    if (min !== undefined) next = Math.max(next, min);
    if (max !== undefined) next = Math.min(next, max);
    setCount(next);
  }, [min, max]);

  return [
    count,
    {
      increment,
      decrement,
      reset,
      setValue,
    },
  ];
}

