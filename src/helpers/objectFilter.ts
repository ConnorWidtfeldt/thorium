export const objectFilter = <T extends object>(
  obj: T,
  predicate: ([key, value]: [keyof T, string]) => boolean,
) =>
  Object.fromEntries(
    (Object.entries(obj) as [keyof T, string][]).filter(predicate),
  );
