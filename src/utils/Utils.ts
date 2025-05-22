interface MyType {
  [key: string]: number; //  Allow any string key
}

const getTimeDifference = (time: Date) => {
  const periods: MyType = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    y: 12 * 30 * 24 * 60 * 60 * 1000,
  };
  const createdAt = new Date(time);
  const now = new Date();
  const diffInMs = now.getTime() - createdAt.getTime();
  let diff = diffInMs.toString() + "ms";

  Object.keys(periods).forEach((period) => {
    if (diffInMs > periods[period]) {
      diff = `${Math.floor(diffInMs / periods[period])}${period}`;
    } else {
      return diff;
    }
  });
  return diff;
};

export { getTimeDifference };
