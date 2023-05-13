import * as React from "react";
import { firestore } from "../../firebase";
import { ClientCatalogItemType } from "../../types/Client";
import { useBranch } from "./BranchContext";

export type MenuContextType = {
  menu: ClientCatalogItemType[];
  isMenuLoading: boolean;
};

const StoreMenuContext = React.createContext<MenuContextType>({
  menu: [],
  isMenuLoading: false,
});

export const useStoreMenuContext = () =>
  React.useContext<MenuContextType>(StoreMenuContext);

type ProviderType = {
  children: React.ReactNode;
};

export function StoreMenuContextProvider({ children }: ProviderType) {
  const { branch } = useBranch();
  const [menu, setMenu] = React.useState<ClientCatalogItemType[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (branch) {
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
          // const cloneMenu = [...menu];

          const newFirstItems = data.sort((a, b) =>
            a.new.includes(branch.id) && !b.new.includes(branch.id) ? -1 : 1
          );

          const unavaliableLastItems = newFirstItems.sort((a, b) =>
            a.available.includes(branch.id) && !b.available.includes(branch.id)
              ? -1
              : 1
          );

          const onlyItemsWithAppliedTags = unavaliableLastItems.filter(
            (item) => item.tags.length > 0
          );

          // return onlyItemsWithActiveTags;
          setMenu(onlyItemsWithAppliedTags);
          setLoading(false);
        });

      return () => unsub();
    } else {
      setMenu([]);
      setLoading(true);
    }
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, [branch]);

  // return { menu, loading };

  return (
    <StoreMenuContext.Provider value={{ menu, isMenuLoading: loading }}>
      {children}
    </StoreMenuContext.Provider>
  );
}
