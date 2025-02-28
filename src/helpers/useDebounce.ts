import {useRef, useEffect, useCallback} from "react";

export const useDebounce = <F extends (...args: any) => any>(
  func: F,
  waitFor: number,
): ((...args: Parameters<F>) => ReturnType<F>) => {
  const timer = useRef<number | null>();
  const savedFunc = useRef<F | null>(func);

  useEffect(() => {
    savedFunc.current = func;
  }, [waitFor, func]);

  return useCallback(
    (...args: any) => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }

      timer.current = setTimeout(() => savedFunc.current?.(...args), waitFor);
    },
    [waitFor],
  ) as (...args: Parameters<F>) => ReturnType<F>;
};
