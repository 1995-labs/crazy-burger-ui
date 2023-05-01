import firebase from "firebase/compat/app";
import * as React from "react";
import { firestore } from "../firebase";
import { UserOrderType } from "../types/User";

type Props = {
  currentUser: firebase.User;
};

const useUserOrders = ({ currentUser }: Props) => {
  const [orders, setOrders] = React.useState<UserOrderType[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("users")
      .doc(currentUser.uid)
      .collection("orders")
      .orderBy("createdAt", "desc")
      .limit(1)
      .onSnapshot((snap) => {
        let documents: any[] = [];
        snap.forEach((doc) =>
          documents.push(
            {
              ...doc.data(),
              id: doc.id,
            }
            // as StoreType
          )
        );
        setOrders(documents);
        setLoading(false);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { orders, loading };
};

export default useUserOrders;
