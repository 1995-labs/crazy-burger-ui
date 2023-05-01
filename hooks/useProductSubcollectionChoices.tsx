import * as React from "react";
import { firestore } from "../firebase";
import {
  ClientCatalogConfigType,
  ClientCatalogConfigType_Choices,
  ClientCatalogItemType,
} from "../types/Client";
// import { StoreType } from "./useAllStores";

export const useProductSubcollectionChoices = (
  // storeid: string,
  option: ClientCatalogConfigType,
  item: ClientCatalogItemType
) => {
  const [choices, setChoices] = React.useState<
    ClientCatalogConfigType_Choices[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("stores")
      .doc(process.env.NEXT_PUBLIC_MAJOR_CLIENT)
      .collection("menu")
      .doc(item.id)
      .collection("options")
      .doc(option.id)
      .collection("choices")
      // .limit(100)
      .onSnapshot(
        (snap) => {
          const local_config = [];
          snap.forEach((res) => {
            local_config.push({ ...res.data(), id: res.id });
          });
          // if (snap.exists) {
          //   setStore({ ...snap.data(), id: snap.id } as ClientType);
          // }
          setChoices(local_config);
          setLoading(false);
        },
        (err) => console.error(err)
      );

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { choices, loading };
};
