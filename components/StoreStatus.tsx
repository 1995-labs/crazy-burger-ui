import { Alert, AlertIcon, Box, useToast } from "@chakra-ui/react";
import React from "react";
import { useBranch } from "../major/internals/BranchContext";

export const StoreStatus = () => {
  const { branch, branches } = useBranch();
  const toast = useToast();
  const id = "test-toast";
  React.useEffect(() => {
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
  }, [branches, branch]);

  return <></>;
};

export const OfflineAlert = () => (
  <Box p={2}>
    <Alert
      // variant={"solid"}
      boxShadow={"sm"}
      status="warning"
      borderRadius={"lg"}
    >
      <AlertIcon />
      We are offline right now
    </Alert>
  </Box>
);
