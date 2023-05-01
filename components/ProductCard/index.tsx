import {
  AspectRatio,
  Box,
  IconButton,
  Image,
  Skeleton,
  Square,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useBranch } from "../../contexts/BranchContext";
import { useCart } from "../../contexts/CartContext";
import { useProductDiscounts } from "../../hooks/useProductDiscounts";
import { useProductSubcollection } from "../../hooks/useProductSubcollection";
import { ClientCatalogItemType } from "../../types/Client";
import { MenuItemDescription } from "../MenuItemDescription";
import ProductCardFooter from "./ProductCardFooter";

type Props = { menuItem: ClientCatalogItemType };

export const ProductCard = ({ menuItem }: Props) => {
  const { branch } = useBranch();
  const { config: options, loading } = useProductSubcollection(
    "options",
    menuItem
  );
  const { discounts, loading: loadingDiscounts } = useProductDiscounts(
    menuItem,
    branch.id
  );

  const { cart, cartIncludes } = useCart();

  const countInCart = cart.reduce(
    (prev, curr) => (curr.id === menuItem.id ? prev + 1 : prev),
    0
  );

  return (
    <Box
      height="100%"
      width="100%"
      position="relative"
      display="flex"
      borderRadius="md"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box px={2} py={2}>
        <Box p="1">
          <Tooltip label={menuItem.name} aria-label={menuItem.name}>
            <Text
              textAlign="center"
              isTruncated
              fontSize="md"
              lineHeight="tight"
              fontWeight="bold"
            >
              {menuItem.name}
            </Text>
          </Tooltip>
        </Box>
        {discounts[0] && (
          <Box>
            <Square
              zIndex={1}
              top={9}
              right={1}
              bg="red.500"
              p={2}
              position="absolute"
              boxShadow="md"
              // borderTopRightRadius={"md"}
            >
              <Text color="white" fontWeight="black">
                {discounts[0].type === "FIXED" && "¢"}
                {discounts[0].discount}
                {discounts[0].type === "PERCENTAGE" && "%"} OFF
              </Text>
            </Square>
          </Box>
        )}

        {cartIncludes(menuItem) && (
          <Box position="relative">
            <Square
              zIndex={1}
              top={-1}
              left={-1}
              size="40px"
              bg="black"
              position="absolute"
              boxShadow="md"
              // borderTopLeftRadius="md"
              // borderRadius="md"
              // color="white"
            >
              <Text color="white" fontWeight="black">
                {countInCart}
              </Text>
            </Square>
          </Box>
        )}

        <Box position="relative">
          <AspectRatio ratio={4 / 3}>
            {/* <Skeleton width="100%" backgroundColor="red" /> */}
            <Image
              src={menuItem.image}
              alt={menuItem.name}
              draggable="false"
              fallback={
                <Skeleton
                  borderTopRightRadius={"md"}
                  borderTopLeftRadius={"md"}
                />
              }
              borderTopRightRadius={"md"}
              borderTopLeftRadius={"md"}
            />
          </AspectRatio>
          {menuItem.description && <MenuItemDescription menuItem={menuItem} />}
        </Box>

        <Box mx={-2}>
          {loading && (
            <IconButton
              size={"lg"}
              colorScheme={"red"}
              width={"100%"}
              boxShadow="md"
              isLoading
              aria-label={"loading"}
            />
          )}
          {!loading && (
            <ProductCardFooter
              options={options}
              menuItem={menuItem}
              discounts={discounts}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
