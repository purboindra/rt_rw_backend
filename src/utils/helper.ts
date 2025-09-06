export const getTelegramKeyForRedis = (arg: string) => {
  const token = arg.slice("verify_".length);
  const key = `tg:verify:${token}`;
  return key;
};

export function pruneUndefined<T extends Record<string, any>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}
