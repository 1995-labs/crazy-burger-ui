import React, { createContext, useContext, useState } from "react";
import { useGetStoreBranches } from "../hooks/useGetStoreBranches";
import { ClientBranchType } from "../types/Client";
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
  const { branches, loading } = useGetStoreBranches();
  const { clearCart } = useCart();

  React.useEffect(() => {
    if (!loading && branches.length > 0) {
      setBranch(branches[0]);
      if (branches.length > 1) {
        setShowQuickView(true);
      }
    }
  }, [branches, loading]);

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
