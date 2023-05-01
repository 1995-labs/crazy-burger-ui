import * as React from "react";
import { firestore } from "../firebase";
import {
  ClientCatalogConfigType,
  ClientCatalogItemType,
} from "../types/Client";
// import { StoreType } from "./useAllStores";

export const useProductSubcollection = (
  // storeid: string,
  subCollection: string,
  item: ClientCatalogItemType
) => {
  const [config, setConfig] = React.useState<ClientCatalogConfigType[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("stores")
      .doc(process.env.NEXT_PUBLIC_MAJOR_CLIENT)
      .collection("menu")
      .doc(item.id)
      .collection(subCollection)
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
          setConfig(local_config);
          setLoading(false);
        },
        (err) => console.error(err)
      );

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { config, loading };
};
