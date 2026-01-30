export const convertDateAndTimeToString = (
  dates: Date,
  time: { hour: number; min: number }
): string => {
  const year = dates.getFullYear();
  const month = dates.getMonth();
  const date = dates.getDate();
  const hour = time.hour;
  const min = time.min;

  return new Date(year, month, date, hour, min).toISOString();
};
