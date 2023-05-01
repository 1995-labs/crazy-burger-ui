import firebase from "firebase/compat/app";
import * as React from "react";
import { firestore } from "../firebase";

type Props = {
  authUser: firebase.User;
};

const useUserLocations = ({ authUser }: Props) => {
  const [locations, setLocations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("users")
      .doc(authUser.uid)
      .collection("locations")
      // .orderBy("createdAt", "desc")
      // .limit(1)
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
        setLocations(documents);
        setLoading(false);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { locations, loading };
};

export default useUserLocations;
