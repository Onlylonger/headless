import { useCounter } from '../hooks/useCounter';
import type { HeadlessCounterProps } from './types';

/**
 * A headless counter component that provides counter functionality
 * without any UI styling. Use the render prop pattern to customize the UI.
 *
 * @example
 * ```tsx
 * <HeadlessCounter initialValue={0} min={0} max={10}>
 *   {({ count, increment, decrement }) => (
 *     <div>
 *       <button onClick={decrement}>-</button>
 *       <span>{count}</span>
 *       <button onClick={increment}>+</button>
 *     </div>
 *   )}
 * </HeadlessCounter>
 * ```
 */
export function HeadlessCounter({
  initialValue = 0,
  value: controlledValue,
  min,
  max,
  step = 1,
  onChange,
  children,
}: HeadlessCounterProps) {
  const [internalCount, actions] = useCounter({
    initialValue,
    min,
    max,
    step,
  });

  const isControlled = controlledValue !== undefined;
  const count = isControlled ? controlledValue : internalCount;

  const increment = () => {
    if (!isControlled) {
      actions.increment();
    }
    const nextValue = count + step;
    if (max === undefined || nextValue <= max) {
      onChange?.(nextValue);
    }
  };

  const decrement = () => {
    if (!isControlled) {
      actions.decrement();
    }
    const nextValue = count - step;
    if (min === undefined || nextValue >= min) {
      onChange?.(nextValue);
    }
  };

  const reset = () => {
    if (!isControlled) {
      actions.reset();
    }
    onChange?.(initialValue);
  };

  const setValue = (newValue: number) => {
    if (!isControlled) {
      actions.setValue(newValue);
    }
    onChange?.(newValue);
  };

  return children({
    count,
    increment,
    decrement,
    reset,
    setValue,
  });
}

