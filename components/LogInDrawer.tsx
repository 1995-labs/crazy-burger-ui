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
  IconButton,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiLogIn, FiX } from "react-icons/fi";
import { Signup } from "./Signup";

export const LogInDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { reference } = router.query;

  return (
    <>
      {reference ? (
        <Button
          // size="lg"
          // colorScheme="red"
          aria-label="Profile"
          onClick={() => onOpen()}
          leftIcon={<FiLogIn size="24px" />}
        >
          Login
        </Button>
      ) : (
        <Tooltip title="Login">
          <IconButton
            // size="lg"
            aria-label="Profile"
            boxShadow={"sm"}
            // variant={"ghost"}
            // colorScheme={"red"}
            onClick={onOpen}
            icon={<FiLogIn size="24px" />}
          ></IconButton>
        </Tooltip>
      )}

      <Drawer
        // trapFocus
        isOpen={isOpen}
        placement="right"
        size="sm"
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader textAlign="center">👋🏾 Login / Sign Up</DrawerHeader>
          {/* <DrawerCloseButton size="lg" /> */}
          <DrawerBody padding={0} mt={12}>
            <Signup />
          </DrawerBody>
          <Divider />
          <DrawerFooter p={0}>
            <Box width={"100%"} p={1}>
              <Button
                leftIcon={<FiX size={"24px"} />}
                width={"100%"}
                variant="outline"
                mr={3}
                onClick={onClose}
              >
                Close
              </Button>
            </Box>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
