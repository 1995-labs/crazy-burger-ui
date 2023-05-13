import React, { createContext, useContext, useState } from "react";
import { firestore } from "../../firebase";
import { ClientBranchType } from "../../types/Client";
import { useCart } from "./CartContext";

export type BranchContextType = {
  branch: ClientBranchType;
  branches: ClientBranchType[];
  loading: boolean;
  setBranch: React.Dispatch<React.SetStateAction<ClientBranchType>>;
  showQuickView: boolean;
  setShowQuickView: React.Dispatch<React.SetStateAction<boolean>>;
};

const BranchContext = createContext<BranchContextType>({
  branch: null,
  branches: [],
  loading: true,
  setBranch: () => {},
  showQuickView: false,
  setShowQuickView: () => {},
});

export const useBranch = () => useContext(BranchContext);

type ProviderType = {
  children: React.ReactNode;
};

export function BranchProvider({ children }: ProviderType) {
  const [branch, setBranch] = useState<ClientBranchType>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  // const { branches, loading } = useGetStoreBranches();
  const { clearCart } = useCart();
  const [branches, setBranches] = React.useState<ClientBranchType[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const unsub = firestore
      .collection("stores")
      .doc(process.env.NEXT_PUBLIC_MAJOR_CLIENT)
      .collection("branches")
      .onSnapshot((snap) => {
        const local_branches: ClientBranchType[] = [];
        snap.forEach((res) => {
          local_branches.push({ ...(res.data() as ClientBranchType) });
        });
        setBranches(local_branches);
        setLoading(false);
      });

    return () => unsub();
    // this is a cleanup function that react will run when
    // a component using the hook unmounts
  }, []);

  React.useEffect(() => {
    if (branches.length > 0) {
      setBranch(branches[0]);
      setShowQuickView(branches.length > 1);
    }
  }, [branches]);

  React.useEffect(() => {
    clearCart();
  }, [branch]);

  const value: BranchContextType = {
    branch,
    branches,
    loading,
    setBranch,
    showQuickView,
    setShowQuickView,
  };

  return (
    <BranchContext.Provider value={value}>{children}</BranchContext.Provider>
  );
}
