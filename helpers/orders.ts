import dayjs from "dayjs";
import { UserOrderType } from "../types/User";

export const hasRecentOrder = (recentOrder: UserOrderType) => {
  // console.log(recentOrder);
  const now = dayjs(new Date());
  const mostRecentOrderTime = dayjs(recentOrder.createdAt.toDate());

  const timeFromNowAndMostRecentOrderTime = now.diff(
    mostRecentOrderTime,
    "minute"
  );

  const isInProgress =
    recentOrder.status === "IN-PROGRESS" || recentOrder.status === "PAID";
  const isRecent = timeFromNowAndMostRecentOrderTime <= 30;

  // console.log({ timeFromNowAndMostRecentOrderTime });

  return isInProgress && isRecent;
};
