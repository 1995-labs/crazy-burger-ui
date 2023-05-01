import { Container } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/react';

export const OrderTableLoading = () => {
  return (
    <Container
      display="flex"
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Spinner size="lg" />
    </Container>
  );
};
