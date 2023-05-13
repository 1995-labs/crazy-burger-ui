import { createContext, useContext, useEffect, useState } from "react";
import { firestore } from "../../firebase";
import { UserOrderType } from "../../types/User";
import { useAuth } from "./UserContext";

export type OrderNotificationContextType = {
  unreviewed: UserOrderType[];
  isUnreviewedLoading: boolean;
  active: UserOrderType[];
  isActiveLoading: boolean;
};

const OrderNotificationContext = createContext<OrderNotificationContextType>({
  unreviewed: [],
  isUnreviewedLoading: true,
  active: [],
  isActiveLoading: true,
});

export const useOrderNotificationContext = () =>
  useContext<OrderNotificationContextType>(OrderNotificationContext);

type ProviderType = {
  children: React.ReactNode;
};

export function OrderNotificationContextProvider({ children }: ProviderType) {
  const [unreviewedOrders, setUnreviewedOrders] = useState<UserOrderType[]>([]);
  const [isUnreviewedLoading, setIsUnreviewedLoading] = useState(true);
  const [recentOrder, setRecentOrder] = useState<UserOrderType[]>([]);
  const [isRecentLoading, setRecentLoading] = useState(true);
  const { authUser } = useAuth();

  useEffect(() => {
    if (authUser) {
      setIsUnreviewedLoading(true);
      const unsub = firestore
        .collection("users")
        .doc(authUser.uid)
        .collection("orders")
        .orderBy("createdAt", "desc")
        // .where("reviewText", )
        .where("store", "==", process.env.NEXT_PUBLIC_MAJOR_CLIENT)
        .where("status", "in", ["COMPLETED"])
        .limit(10)
        .onSnapshot((snap) => {
          let documents: UserOrderType[] = [];
          snap.forEach((doc) => {
            const data = {
              ...doc.data(),
              id: doc.id,
            } as UserOrderType;
            if (!data.reviewRating) {
              documents.push(data);
            }
          });
          // console.log(documents);
          setUnreviewedOrders(documents);
          setIsUnreviewedLoading(false);
        });

      return () => unsub();
    }
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, [authUser]);

  useEffect(() => {
    if (authUser) {
      setRecentLoading(true);
      const unsub = firestore
        .collection("users")
        .doc(authUser.uid)
        .collection("orders")
        .orderBy("createdAt", "desc")
        .where("store", "==", process.env.NEXT_PUBLIC_MAJOR_CLIENT)
        .where("status", "in", ["IN-PROGRESS", "PAID", "READY"])
        // .limit(1)
        .onSnapshot((snap) => {
          let documents: UserOrderType[] = [];
          snap.forEach((doc) =>
            documents.push({
              ...doc.data(),
              id: doc.id,
            } as UserOrderType)
          );
          // console.log(documents);
          setRecentOrder(documents);
          setRecentLoading(false);
        });

      return () => unsub();
    } else {
      setRecentOrder([]);
      setUnreviewedOrders([]);
      setRecentLoading(true);
      setIsUnreviewedLoading(true);
    }
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, [authUser]);

  return (
    <OrderNotificationContext.Provider
      value={{
        unreviewed: unreviewedOrders,
        isUnreviewedLoading,
        active: recentOrder,
        isActiveLoading: isRecentLoading,
      }}
    >
      {children}
    </OrderNotificationContext.Provider>
  );
}
