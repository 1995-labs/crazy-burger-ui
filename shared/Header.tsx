import {
  Box,
  ButtonGroup,
  Divider,
  Flex,
  Image,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React from "react";
import { OrderDrawer } from "../components/OrderDrawer";
import { ProfileDrawer } from "../components/ProfileDrawer";
import { ToggleNav } from "../components/ToggleNav";
import { UserCentric } from "../components/UserCentric";
import { useBranch } from "../contexts/BranchContext";
import { useCart } from "../contexts/CartContext";
import { useUserRecord } from "../contexts/RecordContext";
import { useAuth } from "../contexts/UserContext";
import { useWindowSize } from "../hooks/useWindowSize";
const CartDrawer = dynamic(
  () => import("../components/CartDrawer").then((mod) => mod.CartDrawer),
  { ssr: false }
);

export const charka_dark_color = "#1a202c";
export const charka_dark_color_2 = "#2d3748";

export const Header = () => {
  const { authUser } = useAuth();
  const { record } = useUserRecord();
  const value = useColorModeValue("white", charka_dark_color);
  const { colorMode, toggleColorMode } = useColorMode();
  const { branch } = useBranch();
  const { width } = useWindowSize();
  const { cart } = useCart();

  const router = useRouter();

  const showLogo = React.useCallback(() => {
    let headerSpace = 350;
    if (cart.length === 0) {
      headerSpace = 200;
    }
    return width >= headerSpace;
  }, [width, cart]);

  return (
    <Box
      width="100%"
      zIndex={3}
      top={0}
      position="sticky"
      backgroundColor={value}
    >
      <Box
        as="nav"
        display="flex"
        width="100%"
        justifyContent={"space-between"}
        pr={2}
        py={1}
      >
        {showLogo() && (
          <Flex>
            <Box>
              <Image
                // width="275px"
                height="45px"
                src="/crazy_burger_logo.png"
                alt="the crazy_burger logo"
                draggable="false"
                onClick={() => router.push("/")}
              />
            </Box>
          </Flex>
        )}
        <Flex>
          <ButtonGroup
            alignItems={"center"}
            display="flex"
            variant={"outline"}
            isAttached
          >
            {authUser && <OrderDrawer authUser={authUser} />}
            {authUser && record && (
              <ProfileDrawer authUser={authUser} record={record} />
            )}
          </ButtonGroup>
          <ButtonGroup alignItems={"center"} variant="outline" display="flex">
            {/* {!authUser && <LogInDrawer />} */}
            {branch && <CartDrawer />}
          </ButtonGroup>
        </Flex>
      </Box>
      <Divider />
      <ToggleNav />
      <UserCentric />
    </Box>
  );
};
