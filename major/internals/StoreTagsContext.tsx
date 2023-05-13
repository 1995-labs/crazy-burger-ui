import * as React from "react";
import { firestore } from "../../firebase";
import { ClientCatalogTagConfigType } from "../../types/Client";
import { useBranch } from "./BranchContext";

export type TagsContextType = {
  tags: ClientCatalogTagConfigType[];
  isTagsLoading: boolean;
};

const StoreTagsContext = React.createContext<TagsContextType>({
  tags: [],
  isTagsLoading: false,
});

export const useStoreTagsContext = () =>
  React.useContext<TagsContextType>(StoreTagsContext);

type ProviderType = {
  children: React.ReactNode;
};

export function StoreTagsContextProvider({ children }: ProviderType) {
  const [tags, setTags] = React.useState<ClientCatalogTagConfigType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { branch } = useBranch();
  React.useEffect(() => {
    if (branch) {
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
    } else {
      setTags([]);
      setLoading(true);
    }
  }, [branch]);

  return (
    <StoreTagsContext.Provider value={{ tags, isTagsLoading: loading }}>
      {children}
    </StoreTagsContext.Provider>
  );
}
