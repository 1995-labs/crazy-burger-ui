import { Box, Spinner } from "@chakra-ui/react";

export const PageLoader = () => {
  return (
    <Box
      height={"100%"}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Spinner
        thickness="4px"
        speed="1s"
        emptyColor="gray.200"
        color="red.500"
        size="xl"
      />
    </Box>
  );
};
