import firebase from "firebase/compat/app";
import * as React from "react";
import { firestore } from "../firebase";
import { UserOrderType } from "../types/User";

type Props = {
  user: firebase.User;
  order_id: string;
};

const useLiveOrder = ({ user, order_id }: Props) => {
  const [liveOrder, setLiveOrder] = React.useState<UserOrderType>(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("users")
      .doc(user.uid)
      .collection("orders")
      .doc(order_id)
      .onSnapshot((snap) => {
        if (snap.exists) {
          setLiveOrder({ ...snap.data(), id: snap.id } as UserOrderType);
        }
        setLoading(false);
        // setLoading(false);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { liveOrder, loading };
};

export default useLiveOrder;
