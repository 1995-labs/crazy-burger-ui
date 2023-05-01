import {
  Box,
  IconButton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import { FiTrash } from "react-icons/fi";
import { useCart } from "../contexts/CartContext";
import { calculateCartItemPrice } from "../helpers/cart";
import useMobileLayout from "../hooks/useMobileLayout";
import { UserCheckoutDiscountType } from "./UserCentric";

export const CartList = ({
  rewards,
  back,
}: {
  back?: () => void;
  rewards: UserCheckoutDiscountType;
}) => {
  const { cart, removeFromCart } = useCart();
  const { isSmall } = useMobileLayout();
  const isEmpty = cart.length === 0;

  const checkout_discount = rewards && rewards.checkout_discount;

  // return (
  //   <Box>
  //     {cart.map((item) => (
  //       <Flex
  //         alignItems={"center"}
  //         justifyContent={"space-between"}
  //         key={item.cartId}
  //         minHeight={"50px"}
  //         m={2}
  //         border={"1px solid #e2e8f0 "}
  //         borderRadius={"md"}
  //         px={2}
  //       >
  //         <Box>
  //           <Text fontWeight="semibold">{item.name}</Text>
  //           {item.options &&
  //             item.options.map((option_config) => {
  //               return (
  //                 <Box ml={2} mt={1} key={option_config.id}>
  //                   <Text fontWeight="light">{option_config.label}</Text>
  //                   <Text fontWeight="semibold">
  //                     {option_config.choice.label}
  //                   </Text>
  //                 </Box>
  //               );
  //             })}

  //           {item.add && item.add.length > 0 && (
  //             <Box ml={2} mt={1}>
  //               <Text fontWeight="light">add</Text>

  //               {item.add.map((itemObj) => (
  //                 <Text key={itemObj.id} fontWeight="semibold">
  //                   {itemObj.label}
  //                 </Text>
  //               ))}
  //             </Box>
  //           )}

  //           {item.remove && item.remove.length > 0 && (
  //             <Box ml={2} mt={1}>
  //               <Text fontWeight="light">remove</Text>
  //               {item.remove.map((itemObj) => (
  //                 <Text key={itemObj.id} fontWeight="semibold">
  //                   {itemObj.label}
  //                 </Text>
  //               ))}
  //             </Box>
  //           )}
  //         </Box>

  //         <Box>{calculateCartItemPrice(item, checkout_discount)}</Box>
  //         <Box>
  //           <IconButton
  //             size={isSmall ? "md" : "lg"}
  //             variant="ghost"
  //             colorScheme="red"
  //             aria-label="remove from cart"
  //             icon={
  //               <FiTrash
  //                 size="24px"
  //                 // fill={stateIconFill}
  //                 // name={stateIcon}

  //                 // small, medium, large, xlarge
  //                 // animation=
  //               />
  //             }
  //             onClick={() => removeFromCart(item)}
  //           ></IconButton>
  //         </Box>
  //       </Flex>
  //     ))}
  //   </Box>
  // );
  return (
    <Box position="relative">
      {!isEmpty && (
        <TableContainer>
          <Table width="100%" size={"sm"}>
            <Tbody>
              {cart.map((item) => (
                <Tr key={item.cartId}>
                  <Td>
                    <Text fontWeight="semibold">{item.name}</Text>
                    {item.options &&
                      item.options.map((option_config) => {
                        return (
                          <Box ml={2} mt={1} key={option_config.id}>
                            <Text fontWeight="light">
                              {option_config.label}
                            </Text>
                            <Text fontWeight="semibold">
                              {option_config.choice.label}
                            </Text>
                          </Box>
                        );
                      })}

                    {item.add && item.add.length > 0 && (
                      <Box ml={2} mt={1}>
                        <Text fontWeight="light">add</Text>

                        {item.add.map((itemObj) => (
                          <Text key={itemObj.id} fontWeight="semibold">
                            {itemObj.label}
                          </Text>
                        ))}
                      </Box>
                    )}

                    {item.remove && item.remove.length > 0 && (
                      <Box ml={2} mt={1}>
                        <Text fontWeight="light">remove</Text>
                        {item.remove.map((itemObj) => (
                          <Text key={itemObj.id} fontWeight="semibold">
                            {itemObj.label}
                          </Text>
                        ))}
                      </Box>
                    )}
                  </Td>
                  <Td>{calculateCartItemPrice(item, checkout_discount)}</Td>

                  <Td>
                    <Box display={"flex"} justifyContent={"right"}>
                      <IconButton
                        size={isSmall ? "md" : "lg"}
                        variant="ghost"
                        colorScheme="red"
                        aria-label="remove from cart"
                        icon={
                          <FiTrash
                            size="24px"
                            // fill={stateIconFill}
                            // name={stateIcon}

                            // small, medium, large, xlarge
                            // animation=
                          />
                        }
                        onClick={() => removeFromCart(item)}
                      ></IconButton>
                    </Box>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
