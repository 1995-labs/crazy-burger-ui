import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Flex,
  IconButton,
  Select,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import React from "react";
import { FiCheck, FiMapPin, FiX } from "react-icons/fi";
import ProductGrid from "../components/ProductGrid";
import { StoreNotFound } from "../components/StoreNotFound";
import { useBranch } from "../contexts/BranchContext";
import { useGetStore } from "../hooks/useGetStore";
import { PageLoader } from "../shared/PageLoader";

const FullScreenLoader = () => (
  <Box height={"100%"} display={"flex"} justifyContent={"center"}>
    <PageLoader />
  </Box>
);

const FullScreenStoreNotFound = () => (
  <Box height="100%" display={"flex"} justifyContent={"center"}>
    <StoreNotFound />
  </Box>
);

export default function Home() {
  const { loading, store } = useGetStore();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!store || !store.active) {
    return <FullScreenStoreNotFound />;
  }

  return (
    <Box overflowY={"scroll"} height="fit-content">
      <ProductGrid />
    </Box>
  );
}

export const BranchPrompt = () => {
  const {
    branch,
    loading,
    branches,
    setBranch,
    setShowQuickView,
    showQuickView,
  } = useBranch();
  const [newBranch, setNewBranch] = React.useState(branch);
  // const [isModalOpen, setIsModalOpen] = React.useState(true);
  // const firstView = React.useRef(true);
  const ref = React.useRef(null);
  useOutsideClick({
    ref: ref,
    handler: () => setShowQuickView(false),
  });
  // React.

  if (showQuickView) {
    return (
      <Flex justifyContent={"center"}>
        <Card
          position={"absolute"}
          bottom={0}
          width={"60%"}
          ref={ref}
          my={2}
          zIndex={4}
          backgroundColor={"white"}
          display={"flex"}
          p={2}
          variant={"elevated"}
        >
          <Flex p={2} justifyContent={"center"}>
            <FiMapPin size="24px" />
            <Text ml={2} fontWeight={"bold"}>
              Change Branch
            </Text>
          </Flex>
          <Box p={2}>
            <Select
              value={newBranch?.id}
              isDisabled={loading}
              onChange={(e) => {
                const newBranch = branches.find(
                  (branch) => branch.id === e.target.value
                );
                setNewBranch(newBranch);
              }}
              placeholder="Select branch"
            >
              {branches.map((branch) => {
                return (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                );
              })}
            </Select>
          </Box>

          <ButtonGroup p={2} variant={"outline"}>
            <Button
              leftIcon={<FiCheck />}
              width={"100%"}
              isLoading={loading}
              isDisabled={!newBranch}
              boxShadow={"sm"}
              onClick={() => {
                setBranch(newBranch);
                setShowQuickView(false);
              }}
            >
              Change
            </Button>
            <IconButton
              icon={<FiX />}
              onClick={() => {
                setShowQuickView(false);
              }}
              aria-label="close"
            />
          </ButtonGroup>
        </Card>
      </Flex>
    );
  }

  // React.useEffect(() => {
  //   if (!loading && branch && branches.length > 1) {
  //     if (!toast.isActive(toastId)) {
  //       toast({
  //         id: toastId,
  //         duration: null,
  //         // isClosable: true,
  //         // render
  //         render: ({ id, onClose }) => {
  //           console.log("toast");
  //           // const { branches, setBranch } = useBranch();
  //           return (

  //           );
  //         },
  //       });
  //     }
  //   }
  // }, [branch, loading, branches]);

  return <></>;
};
