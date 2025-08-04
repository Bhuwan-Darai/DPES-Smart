export const getNepalLocalDate = (utcDateString: string) => {
  const utcDate = new Date(utcDateString);

  // Nepal is UTC+5:45 => 345 minutes = 20700000 ms
  const nepalOffsetInMs = 5 * 60 * 60 * 1000 + 45 * 60 * 1000;

  return new Date(utcDate.getTime() + nepalOffsetInMs);
};
