// that string will be javascript timestamp
export const readableDate = (date: string) => {
  const timestamp = new Date(Number(date));
  const toReturn = new Date(timestamp).toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  console.log(toReturn);
  return toReturn;
}
