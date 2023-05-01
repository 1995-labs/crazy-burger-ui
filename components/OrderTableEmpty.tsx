import { Alert, AlertIcon } from '@chakra-ui/react';

export const OrderTableEmpty = () => {
  return (
    <Alert status="info">
      <AlertIcon />
      You have no orders
    </Alert>
  );
};
