import React, { createContext, useContext, useState } from "react";
import { useGetStoreBranches } from "../hooks/useGetStoreBranches";
import { ClientBranchType } from "../types/Client";

export type BranchContextType = {
  branch: ClientBranchType;
  branches: ClientBranchType[];
  loading: boolean;
  setBranch: React.Dispatch<React.SetStateAction<ClientBranchType>>;
};

const BranchContext = createContext<BranchContextType>({
  branch: null,
  branches: [],
  loading: true,
  setBranch: () => {},
});

export const useBranch = () => useContext(BranchContext);

type ProviderType = {
  children: React.ReactNode;
};

export function BranchProvider({ children }: ProviderType) {
  const [branch, setBranch] = useState<ClientBranchType>(null);
  const { branches, loading } = useGetStoreBranches();

  React.useEffect(() => {
    if (!loading && branches.length > 0) {
      // console.log(branches[0]);
      setBranch(branches[0]);
    }
  }, [branches, loading]);

  const value: BranchContextType = {
    branch,
    branches,
    loading,
    setBranch,
  };

  return (
    <BranchContext.Provider value={value}>{children}</BranchContext.Provider>
  );
}
