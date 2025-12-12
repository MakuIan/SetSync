import type { Timestamp } from "firebase/firestore";

export const getDateObj = (ts: Timestamp | null) => {
  if (!ts) return null;
  if (ts.toDate) return ts.toDate();
  if (ts.seconds) return new Date(ts.seconds * 1000);
  return null;
};
