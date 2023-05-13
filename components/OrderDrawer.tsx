import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import firebase from "firebase/compat";
import { X } from "lucide-react";
import { FiArchive } from "react-icons/fi";
import { useUserRewards } from "../major/internals/RewardsContext";
import { OrderTable } from "./OrderTable";

export const OrderDrawer = ({ authUser }: { authUser: firebase.User }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onDrawerClose = () => {
    onClose();
  };

  return (
    <>
      <IconButton
        aria-label="Orders"
        onClick={onOpen}
        // variant={"outline"}
        boxShadow={"sm"}
        icon={<FiArchive size="24px" />}
      ></IconButton>

      <Drawer
        isOpen={isOpen}
        placement="right"
        size="sm"
        onClose={onDrawerClose}
        // borderRadius={"md"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            fontWeight="black"
            textAlign="center"
            border={"1px solid #e2e8f0"}
            className={"primaryFont"}
          >
            Order History
          </DrawerHeader>
          {/* <DrawerCloseButton size="lg" /> */}

          <DrawerBody padding={0} position="relative">
            <UserRewards />
            <OrderTable onClose={onClose} authUser={authUser} />
          </DrawerBody>
          <Divider />
          <DrawerFooter p={1}>
            <Button
              leftIcon={<X size="24px" />}
              onClick={onClose}
              size="lg"
              width={"100%"}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const UserRewards = () => {
  const { rewards } = useUserRewards();

  if (!rewards) {
    return (
      <Box
        position="sticky"
        top={0}
        height="50px"
        zIndex={2}
        borderBottom={"1px solid #e2e8f0"}
        backgroundColor="white"
        p={4}
      >
        <Heading fontWeight="black" size="sm">
          No rewards...
        </Heading>
      </Box>
    );
  }

  // console.log(rewards);
  return (
    <Box
      position="sticky"
      top={0}
      height="50px"
      zIndex={2}
      borderBottom={"1px solid #e2e8f0"}
      backgroundColor="white"
      p={4}
    >
      <Heading fontWeight="black" size="sm">
        Lifetime Points: {rewards.lifetime_total || 0}
      </Heading>
    </Box>
  );
};
