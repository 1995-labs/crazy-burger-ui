import firebase from "firebase/compat/app";
import * as React from "react";
import { firestore } from "../firebase";
import { UserOrderType } from "../types/User";

type Props = {
  authUser: firebase.User;
};

export const useUserUnreviewedOrders = ({ authUser }: Props) => {
  const [unreviewedOrders, setUnreviewedOrders] = React.useState<
    UserOrderType[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
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
        setLoading(false);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { unreviewedOrders, loading };
};
