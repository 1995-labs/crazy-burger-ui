import { Alert, AlertIcon, Box } from "@chakra-ui/react";

export const StoreNotFound = () => (
  <Box p={2} width={"100%"}>
    <Alert
      // variant={"solid"}
      borderRadius={"lg"}
      display="flex"
      // width={"100%"}
      justifyContent="center"
      status="warning"
    >
      <AlertIcon />
      Store is no longer active.
    </Alert>
  </Box>
);
