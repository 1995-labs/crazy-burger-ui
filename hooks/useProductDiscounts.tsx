import * as React from "react";
import { firestore } from "../firebase";
import { ClientCatalogItemType } from "../types/Client";
// import { StoreType } from "./useAllStores";

export const useProductDiscounts = (
  // storeid: string,
  menuItem: ClientCatalogItemType,
  branch: string
) => {
  const [discounts, setDiscounts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("stores")
      .doc(process.env.NEXT_PUBLIC_MAJOR_CLIENT)
      .collection("menu")
      .doc(menuItem.id)
      .collection("discounts")
      .where("branch", "==", branch)
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
          setDiscounts(local_config);
          setLoading(false);
        },
        (err) => console.error(err)
      );

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { discounts, loading };
};
