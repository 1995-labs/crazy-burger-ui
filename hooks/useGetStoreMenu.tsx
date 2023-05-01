import * as React from "react";
import { firestore } from "../firebase";
import { ClientBranchType, ClientCatalogItemType } from "../types/Client";
// import { StoreType } from "./useAllStores";

export const useGetStoreMenu = (branch: ClientBranchType) => {
  const [menu, setMenu] = React.useState<ClientCatalogItemType[]>([]);
  const [loading, setLoading] = React.useState(true);
  // const { branch } = useBranch();
  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("stores")
      .doc(process.env.NEXT_PUBLIC_MAJOR_CLIENT)
      .collection("menu")
      .where("show", "array-contains", branch.id)
      .limit(100)
      .onSnapshot((snap) => {
        let data = [];
        snap.forEach((res) => {
          data.push({ ...res.data(), id: res.id } as ClientCatalogItemType);
        });
        setMenu(data);
        setLoading(false);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { menu, loading };
};
