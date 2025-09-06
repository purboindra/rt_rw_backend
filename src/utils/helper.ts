export const getTelegramKeyForRedis = (arg: string) => {
  const token = arg.slice("verify_".length);
  const key = `tg:verify:${token}`;
  return key;
};
