export type UseToggleReturn = [boolean, () => void, (value: boolean) => void];

export type UseCounterReturn = [
  number,
  {
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    setValue: (value: number) => void;
  }
];

