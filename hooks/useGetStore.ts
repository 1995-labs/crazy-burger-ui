import * as React from "react";
import { firestore } from "../firebase";
import { ClientType } from "../types/Client";
// import { StoreType } from "./useAllStores";

export const useGetStore = () => {
  const [store, setStore] = React.useState<ClientType>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("stores")
      .doc(process.env.NEXT_PUBLIC_MAJOR_CLIENT)
      .onSnapshot((snap) => {
        if (snap.exists) {
          setStore({ ...snap.data(), id: snap.id } as ClientType);
        }
        setLoading(false);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { store, loading };
};
