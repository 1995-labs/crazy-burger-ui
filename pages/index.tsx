import { Box } from "@chakra-ui/react";
import ProductGrid from "../components/ProductGrid";
import { StoreNotFound } from "../components/StoreNotFound";
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
