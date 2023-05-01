import firebase from "firebase/compat/app";
import * as React from "react";
import { firestore } from "../firebase";
import { UserType } from "../types/User";

type Props = {
  currentUser: firebase.User;
};

const useUserRecord = ({ currentUser }: Props) => {
  const [record, setRecord] = React.useState<UserType>(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("users")
      .doc(currentUser.uid)
      .onSnapshot((snap) => {
        if (snap.exists) {
          setRecord({ ...(snap.data() as UserType) });
        }
        setLoading(false);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { record, loading };
};

export default useUserRecord;
