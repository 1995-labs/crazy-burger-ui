import { Box, Container } from "@chakra-ui/react";
import { SignupForm } from "../forms/SignupForm";

export const Signup = () => {
  return (
    <>
      <Container
        display="flex"
        flexDirection="column"
        width="100%"
        height="100%"
      >
        <Box mt={2} height="100%">
          <SignupForm />
        </Box>
      </Container>
    </>
  );
};
