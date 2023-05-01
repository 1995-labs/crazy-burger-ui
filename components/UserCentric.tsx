import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import firebase from "firebase/compat/app";
import { FileSignature } from "lucide-react";
import { NextRouter } from "next/router";
import React from "react";
import { FiActivity } from "react-icons/fi";
import { useOrderNotificationContext } from "../contexts/OrderNotificationContext";
// import Icon from "react-eva-icons";
// import { A2HSProvider } from  'react-a2hs'
import useUserRecord from "../hooks/useUserRecord";
import { charka_dark_color } from "../shared/Header";
import { UserOrderType } from "../types/User";
import OrderCard from "./OrderCard";

const clearURL = (router: NextRouter) => {
  router.replace("/", undefined, { shallow: true });
};

export const UserCentric = () => {
  const value = useColorModeValue("white", charka_dark_color);
  const { unreviewed, active, isActiveLoading, isUnreviewedLoading } =
    useOrderNotificationContext();

  return (
    <Collapse in={unreviewed.length > 0 || active.length > 0} animateOpacity>
      <Box backgroundColor={value}>
        <Flex py={1} className="ToggleNav" overflowX="auto" flexWrap="nowrap">
          {active.length > 0 && (
            <Box mx={1}>
              <OrderDrawerList
                orders={active}
                loading={isActiveLoading}
                type={"active"}
                color={"green"}
                icon={<FiActivity size={"24"} />}
              />
            </Box>
          )}
          {unreviewed.length > 0 && (
            <Box mx={1}>
              <OrderDrawerList
                orders={unreviewed}
                loading={isUnreviewedLoading}
                type={"unreviewed"}
                color={"blue"}
                icon={<FileSignature size={"24"} />}
              />
            </Box>
          )}
        </Flex>
        <Divider />
      </Box>
    </Collapse>
  );
};

const OrderDrawerList = ({
  orders,
  loading,
  type,
  icon,
  color,
}: {
  orders: UserOrderType[];
  loading: boolean;
  type: string;
  icon: any;
  color: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  React.useEffect(() => {
    orders.length === 0 && onClose();
  }, [onClose, orders]);

  if (loading) {
    return (
      <Button
        // size="lg"
        aria-label="Live Orders"
        boxShadow={"sm"}
        // variant="outline"
        colorScheme="gray"
        isLoading
        loadingText="Fetching..."
        // boxShadow="lg"

        leftIcon={icon}
      ></Button>
    );
  }

  return (
    <Box>
      {orders.length !== 0 && (
        <Button
          size={"sm"}
          variant={"outline"}
          boxShadow={"sm"}
          aria-label="Live Orders"
          colorScheme={color}
          onClick={onOpen}
          leftIcon={icon}
        >
          {orders.length} {type} order
          {orders.length > 1 ? "s" : ""}
        </Button>
      )}

      <Drawer
        isOpen={isOpen}
        placement="right"
        size="sm"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton size="lg" />
          <DrawerHeader
            textTransform={"capitalize"}
            textAlign="center"
            boxShadow="sm"
          >
            {type} Order{orders.length > 1 ? "s" : ""}
          </DrawerHeader>

          <DrawerBody p={0}>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export const transform = (discount) => {
  if (discount.type === "PERCENTAGE") return `${discount.discount}%`;
  if (discount.type === "FIXED") return `GHC ${discount.discount}`;
  // return `GHC ${discount.discount} OFF`
};

export type UserCheckoutDiscountType = {
  checkout_discount: { discount: number; type: string };
  id: string;
  lifetime_total: number;
};

const UserStatus = ({ authUser }: { authUser: firebase.User }) => {
  const { record, loading } = useUserRecord({ currentUser: authUser });

  if (!record) {
    return <></>;
  }

  if (record && !record.email) {
    return (
      <Box>
        <Alert status="warning">
          <AlertIcon />
          An email address has not be added to your account
        </Alert>
      </Box>
    );
  }

  return <></>;
};
