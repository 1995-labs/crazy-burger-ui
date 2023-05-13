import * as React from "react";

export type AuthContextType = {
  filters: string[];
  setFilters: React.Dispatch<React.SetStateAction<string[]>>;
};

const SearchContext = React.createContext<AuthContextType>({
  filters: [],
  setFilters: () => {},
});

export const useSearchContext = () =>
  React.useContext<AuthContextType>(SearchContext);

type ProviderType = {
  children: React.ReactNode;
};

export function SearchContextProvider({ children }: ProviderType) {
  const [filters, setFilters] = React.useState<string[]>([]);
  // const {} useGetStoreTags();
  const value = {
    setFilters,
    filters,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}
