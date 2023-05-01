import firebase from "firebase/compat/app";
import * as React from "react";
import { firestore } from "../firebase";
import { UserOrderType } from "../types/User";

type Props = {
  authUser: firebase.User;
  order: UserOrderType;
};

const useGetOrderNotifications = ({ authUser, order }: Props) => {
  const [notifications, setNotifications] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("users")
      .doc(authUser.uid)
      .collection("notifications")
      // .where("order.store", "==", process.env.NEXT_PUBLIC_MAJOR_CLIENT)
      .where("orderId", "==", order.id)
      .limit(100)
      .onSnapshot((snap) => {
        let local = [];
        snap.forEach((doc) => {
          local.push({ ...doc.data(), id: doc.id });
        });
        setNotifications(local);
        setLoading(false);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { notifications, loading };
};

export default useGetOrderNotifications;
