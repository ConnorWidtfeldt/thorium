export const objectMap = <T extends object>(
  obj: T,
  fn: (key: keyof T, value: any, index: number) => any,
) =>
  Object.fromEntries(
    (Object.entries(obj) as [keyof T, any]).map(([k, v], i) => [
      k,
      fn(k, v, i),
    ]),
  );
