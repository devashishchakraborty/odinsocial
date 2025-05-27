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

const convertTimestampToDate = (timestamp: Date) => {
  const date = new Date(timestamp);
  const formatted = date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  return formatted;
}

const formatDate = (_date: Date) => {
  const date = new Date(_date);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedMinutes = minutes.toString().padStart(2, '0'); // Ensure two digits

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${formattedHours}:${formattedMinutes} ${ampm} · ${month} ${day}, ${year}`;
}

export { getTimeDifference, convertTimestampToDate, formatDate };
