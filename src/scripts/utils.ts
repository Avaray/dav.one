export const readableDate = (date: string, full = false) => {
  return new Date(Number(date)).toLocaleDateString('en-us', {
    year: 'numeric',
    month: full ? 'long' : 'short',
    day: 'numeric',
  });
}
