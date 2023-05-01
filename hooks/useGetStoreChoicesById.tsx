import * as React from "react";
import { firestore } from "../firebase";
import { ClientCatalogConfigType_Choices } from "../types/Client";
// import { StoreType } from "./useAllStores";

export const useGetStoreChoices = (store: string, choiceId: string) => {
  const [choice, setChoice] =
    React.useState<ClientCatalogConfigType_Choices>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("stores")
      .doc(store)

      .collection("choices")
      .doc(choiceId)
      .onSnapshot((snap) => {
        if (snap.exists) {
          setChoice({
            ...snap.data(),
            id: snap.id,
          } as ClientCatalogConfigType_Choices);
        }
        setLoading(false);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { choice, loading };
};
