import firebase from "firebase/compat/app";
import * as React from "react";
import { firestore } from "../firebase";
import { UserOrderType } from "../types/User";

type Props = {
  authUser: firebase.User;
};

export const useUserRecordOrders = ({ authUser }: Props) => {
  const [recentOrder, setRecentOrder] = React.useState<UserOrderType[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
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
        setLoading(false);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { recentOrder, loading };
};
