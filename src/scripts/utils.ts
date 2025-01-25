export const readableDate = (date: string) => {
  return new Date(Number(date)).toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
