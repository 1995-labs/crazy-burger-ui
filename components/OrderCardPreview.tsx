import { Box, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import firebase from "firebase/compat/app";
import useLastLiveOrder from "../hooks/useLastLiveOrder";
import { PageLoader } from "../shared/PageLoader";
import { UserOrderType } from "../types/User";
import OrderCard from "./OrderCard";

const displayOrderStatusBadge = (order: UserOrderType) => {
  if (order.status === "CANCELLED") {
    return (
      <Box display="flex" width="100%" flexDirection="column">
        <Box
          borderTopRadius="lg"
          p={2}
          display="flex"
          justifyContent="center"
          // flexDirection="column"
          backgroundColor="gray.400"
          width="100%"
        >
          <Text textAlign="center" fontWeight="extrabold">
            CANCELLED
          </Text>
        </Box>
      </Box>
    );
  } else if (order.status === "IN-PROGRESS") {
    const now = dayjs();
    const eta = dayjs(order.eta);
    const timer = eta.diff(now, "minute");
    return (
      <Box
        p={2}
        display="flex"
        justifyContent="center"
        backgroundColor="green.400"
        width="100%"
        borderTopRadius="lg"
      >
        {timer > 0 ? (
          <Text fontWeight="extrabold">
            READY IN {timer} MIN{timer > 1 ? "S" : ""}
          </Text>
        ) : (
          <Text fontWeight="extrabold">READY SOON</Text>
        )}
      </Box>
    );
  } else if (order.status === "PAID") {
    return (
      <Box
        p={2}
        display="flex"
        justifyContent="center"
        backgroundColor="green.400"
        width="100%"
        borderTopRadius="lg"
      >
        <Text fontWeight="extrabold">PAID</Text>
      </Box>
    );
  } else if (order.status === "READY") {
    return (
      <Box
        p={2}
        display="flex"
        justifyContent="center"
        backgroundColor="green.400"
        width="100%"
        borderTopRadius="lg"
      >
        <Text fontWeight="extrabold">READY FOR PICK UP</Text>
      </Box>
    );
  } else if (order.status === "COMPLETED") {
    return (
      <Box
        p={2}
        display="flex"
        justifyContent="center"
        backgroundColor="green.400"
        width="100%"
        borderTopRadius="lg"
      >
        <Text fontWeight="extrabold">COMPLETED</Text>
      </Box>
    );
  } else if (order.status === "IN-COMPLETE") {
    return (
      <Box
        p={2}
        display="flex"
        justifyContent="center"
        backgroundColor="green.300"
        width="100%"
      >
        <Text fontWeight="extrabold">IN-COMPLETE</Text>
      </Box>
    );
  }
};

// const

export function OrderCardPreview({ user }: { user: firebase.User }) {
  const { loading, liveOrder } = useLastLiveOrder({ user });

  if (loading || !liveOrder) {
    return <PageLoader />;
  }

  return (
    <Box>
      {/* <Alert status="success">
        <AlertIcon />
        Thank you for your order!
      </Alert> */}
      <Box mt={4}>
        <OrderCard order={liveOrder} />
      </Box>
    </Box>
  );
}

export default OrderCardPreview;
