import firebase from "firebase/compat/app";
import * as React from "react";
import { firestore } from "../firebase";
import { UserOrderType } from "../types/User";

type Props = {
  user: firebase.User;
  // order_id: string;
};

const useLastLiveOrder = ({ user }: Props) => {
  const [liveOrder, setLiveOrder] = React.useState<UserOrderType>(null);
  const [loading, setLoading] = React.useState(true);
  // console.log({ user: user.uid, order_id });
  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("users")
      .doc(user.uid)
      .collection("orders")
      .orderBy("createdAt", "desc")
      .limit(1)
      // .withConverter
      // .doc(order_id)
      .onSnapshot((snap) => {
        let local = [];
        snap.forEach((doc) => {
          local.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        // if (snap.docs) {
        // }
        setLiveOrder(local[0] as UserOrderType);
        setLoading(false);
        // setLoading(false);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { liveOrder, loading };
};

export default useLastLiveOrder;
