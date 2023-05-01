import firebase from "firebase/compat/app";
import * as React from "react";
import { UserCheckoutDiscountType } from "../components/UserCentric";
import { firestore } from "../firebase";

type Props = {
  currentUser: firebase.User;
};

const useGetCustomerRewards = ({ currentUser }: Props) => {
  const [rewards, setRewards] = React.useState<UserCheckoutDiscountType>(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("users")
      .doc(currentUser.uid)
      .collection("rewards")
      .doc(process.env.NEXT_PUBLIC_MAJOR_CLIENT)
      .onSnapshot((snap) => {
        if (snap.exists) {
          setRewards({ ...(snap.data() as UserCheckoutDiscountType) });
        }
        setLoading(false);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { rewards, loading };
};

export default useGetCustomerRewards;
