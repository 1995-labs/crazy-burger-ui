import * as React from "react";
import { firestore } from "../firebase";
import { ClientBranchType, ClientCatalogTagConfigType } from "../types/Client";
// import { StoreType } from "./useAllStores";

export const useGetStoreTags = ({ branch }: { branch: ClientBranchType }) => {
  const [tags, setTags] = React.useState<ClientCatalogTagConfigType[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("stores")
      .doc(process.env.NEXT_PUBLIC_MAJOR_CLIENT)
      .collection("tags")
      .where("show", "array-contains-any", [branch.id])
      .onSnapshot((snap) => {
        const local_tags: ClientCatalogTagConfigType[] = [];
        snap.forEach((res) => {
          local_tags.push({
            ...res.data(),
            id: res.id,
          } as ClientCatalogTagConfigType);
        });
        setTags(local_tags);
        setLoading(false);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  return { tags, loading };
};
