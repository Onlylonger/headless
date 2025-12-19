import type { ReactNode } from 'react';

export interface HeadlessToggleProps {
  /**
   * The initial toggle state
   */
  initialValue?: boolean;
  /**
   * Controlled value
   */
  value?: boolean;
  /**
   * Callback when toggle state changes
   */
  onChange?: (value: boolean) => void;
  /**
   * Render function that receives toggle state and handlers
   */
  children: (props: {
    isOn: boolean;
    toggle: () => void;
    setOn: () => void;
    setOff: () => void;
  }) => ReactNode;
}

export interface HeadlessCounterProps {
  /**
   * Initial counter value
   */
  initialValue?: number;
  /**
   * Controlled value
   */
  value?: number;
  /**
   * Minimum value
   */
  min?: number;
  /**
   * Maximum value
   */
  max?: number;
  /**
   * Step value
   */
  step?: number;
  /**
   * Callback when counter value changes
   */
  onChange?: (value: number) => void;
  /**
   * Render function that receives counter state and handlers
   */
  children: (props: {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    setValue: (value: number) => void;
  }) => ReactNode;
}

