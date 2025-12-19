import { useToggle } from '../hooks/useToggle';
import type { HeadlessToggleProps } from './types';

/**
 * A headless toggle component that provides toggle functionality
 * without any UI styling. Use the render prop pattern to customize the UI.
 *
 * @example
 * ```tsx
 * <HeadlessToggle>
 *   {({ isOn, toggle }) => (
 *     <button onClick={toggle}>
 *       {isOn ? 'On' : 'Off'}
 *     </button>
 *   )}
 * </HeadlessToggle>
 * ```
 */
export function HeadlessToggle({
  initialValue = false,
  value: controlledValue,
  onChange,
  children,
}: HeadlessToggleProps) {
  const [internalValue, toggle, setValue] = useToggle(initialValue);

  const isControlled = controlledValue !== undefined;
  const isOn = isControlled ? controlledValue : internalValue;

  const handleToggle = () => {
    if (!isControlled) {
      toggle();
    }
    onChange?.(!isOn);
  };

  const setOn = () => {
    if (!isControlled) {
      setValue(true);
    }
    onChange?.(true);
  };

  const setOff = () => {
    if (!isControlled) {
      setValue(false);
    }
    onChange?.(false);
  };

  return children({
    isOn,
    toggle: handleToggle,
    setOn,
    setOff,
  });
}

