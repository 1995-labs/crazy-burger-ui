import { useToast } from "@chakra-ui/react";
import { createContext, useEffect } from "react";
import { BranchPrompt } from "../pages";
import { useBranch } from "./BranchContext";

const StoreStatusContext = createContext({});

export const StoreStatusProvider = ({ children }) => {
  const { branch, branches, loading } = useBranch();
  const toast = useToast();
  const id = "test-toast";

  useEffect(() => {
    if (!loading && branch) {
      const selectedBranch = branches.find(
        (local_branch) => local_branch.id === branch.id
      );

      if (selectedBranch && !selectedBranch.online) {
        if (!toast.isActive(id)) {
          toast({
            id,
            title: "Sorry! We are offline right now.",
            // description: "We've created your account for you.",
            status: "warning",
            duration: null,
            isClosable: true,
            // position: "top",
          });
        }
      }
    }
  }, [branches, branch, loading, toast]);

  return (
    <StoreStatusContext.Provider value={{}}>
      <BranchPrompt />
      {children}
    </StoreStatusContext.Provider>
  );
};
// custom hook to use the authUserContext and access authUser and loading
// export const useUserRewards = () => useContext(RewardsContext);
