import { format } from "date-fns";

export const formatDate = (seconds: number) => {
  const date = new Date(seconds * 1000);

  const formattedDate = format(date, "HH:mm, MMM d, yyyy");

  return formattedDate;
};