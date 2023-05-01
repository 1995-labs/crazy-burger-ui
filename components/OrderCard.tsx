import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Divider,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Tr,
  UnorderedList,
  useDisclosure,
} from "@chakra-ui/react";
import { AnnotationIcon } from "@heroicons/react/outline";
import dayjs from "dayjs";
import React from "react";
import {
  FiCreditCard,
  FiFileText,
  FiHelpCircle,
  FiSend,
  FiSlash,
} from "react-icons/fi";
import { usePaystackPayment } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";
import ReactStars from "react-rating-stars-component";
import { useBranch } from "../contexts/BranchContext";
import { useAuth } from "../contexts/UserContext";
import { functions } from "../firebase";
import { calculateCartItemPrice } from "../helpers/cart";
import useGetOrderNotifications from "../hooks/useGetOrderNotifications";
import useMobileLayout from "../hooks/useMobileLayout";
import { UserOrderType } from "../types/User";
// import { calculateCartTotal } from './PayButton'
// import {  } from "./OrderDetailsModal";
import { formatOrderDate, formatOrderDateShort } from "./OrderTable";
import { transform } from "./UserCentric";

export const displayOrderStatusBadge = (order: UserOrderType) => {
  if (order.status === "CANCELLED") {
    return (
      <Box display="flex" width="100%" flexDirection="column">
        <Box
          // borderTopRadius="lg"
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
        {/* <Box
            // my={1}
            p={2}
            display="flex"
            justifyContent="center"
            // flexDirection="column"
            backgroundColor="gray.100"
            width="100%"
          >
            <Text lineHeight="none" textAlign="center" fontWeight="light">
              Refund date:{" "}
              {new Date(order.expectRefund).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </Box> */}
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
        // borderTopRadius="lg"
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
        // borderTopRadius="lg"
      >
        <Text fontWeight="extrabold">PAID</Text>
      </Box>
    );
  } else if (order.status === "READY") {
    if (order.logistics === "delivery") {
      return (
        <Box
          p={2}
          display="flex"
          justifyContent="center"
          backgroundColor="green.400"
          width="100%"
          // borderTopRadius="lg"
        >
          <Text fontWeight="extrabold">READY FOR DELIVERY</Text>
        </Box>
      );
    }
    return (
      <Box
        p={2}
        display="flex"
        justifyContent="center"
        backgroundColor="green.400"
        width="100%"
        // borderTopRadius="lg"
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
        // borderTopRadius="lg"
      >
        <Text fontWeight="extrabold">COMPLETED</Text>
      </Box>
    );
  } else if (order.status === "IN-COMPLETE") {
    return (
      <Box
        p={2}
        display="flex"
        // borderTopRadius="lg"
        justifyContent="center"
        backgroundColor="gray.100"
        width="100%"
      >
        <Text fontWeight="extrabold">IN-COMPLETE</Text>
      </Box>
    );
  }
};

function OrderCard({ order }: { order: UserOrderType }) {
  const { isSmall } = useMobileLayout();
  const [showInput, setShowInput] = React.useState(false);
  const [reviewText, setReviewText] = React.useState("");
  const [deliveryStarRating, setDeliveryStarRating] = React.useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);
  const [isSubmittingCancel, setIsSubmittingCancel] = React.useState(false);
  const { authUser } = useAuth();
  const { loading, notifications } = useGetOrderNotifications({
    authUser,
    order,
  });

  React.useEffect(() => {
    if (!showInput) {
      setReviewText("");
    }
  }, [showInput]);

  const ratingChanged = (newRating) => {
    setDeliveryStarRating(newRating);
  };

  const handleOrderRequestCancellation = async () => {
    setIsSubmittingCancel(true);
    const user_request_order_cancellations = functions.httpsCallable(
      "user_request_order_cancellations"
    );
    // console.log(order);
    user_request_order_cancellations({
      orderId: order.id,
      customerId: order.customerId,
      store: order.store,
      notification: {
        message: ["You requested this order be cancelled"],
        read: false,
        // log_time: new Date(),
        orderId: order.id,
      },
    })
      .catch((err) => {
        console.error({ err });
      })
      .finally(() => {
        setIsSubmittingCancel(false);
      });
  };

  const handleOrderReviewSubmit = async () => {
    setIsSubmittingReview(true);
    const user_set_order_review = functions.httpsCallable(
      "user_set_order_review"
    );
    user_set_order_review({
      authUserId: authUser.uid,
      orderId: order.id,
      storeName: process.env.NEXT_PUBLIC_MAJOR_CLIENT,
      reviewRating: deliveryStarRating,
      reviewText,
    })
      .then(() => setShowInput(false))
      .catch((e) => console.error(e))
      .finally(() => {
        setIsSubmittingReview(false);
      });
  };

  return (
    <Box mx={4} border={"1px solid #e2e8f0"} mb={isSmall ? 2 : 4}>
      <Box display="flex" justifyContent="center">
        {displayOrderStatusBadge(order)}
      </Box>

      {["IN-COMPLETE"].includes(order.status) && (
        <Alert status="info">
          <AlertIcon />
          <AlertTitle mr={2}>
            Please wait while we receive your order
          </AlertTitle>
          {/* <AlertDescription>
          Your Chakra experience may be degraded.
        </AlertDescription> */}
          {/* <CloseButton position="absolute" right="8px" top="8px" /> */}
        </Alert>
      )}

      {["PAID"].includes(order.status) && (
        <Alert status="info">
          <AlertIcon />
          <AlertTitle mr={2}>
            Please wait while we confirm your order
          </AlertTitle>
        </Alert>
      )}

      {["IN-PROGRESS"].includes(order.status) && (
        <Alert status="info">
          <AlertIcon />
          <AlertTitle mr={2}>Please wait your order is being made</AlertTitle>
        </Alert>
      )}

      {["READY"].includes(order.status) && (
        <Alert status="info">
          <AlertIcon />
          <AlertTitle mr={2}>
            Your order is now ready for {order.logistics}
          </AlertTitle>
        </Alert>
      )}

      <Box mx={2} mt={2} display="flex" flexDirection="column">
        {["CANCELLED"].includes(order.status) && (
          <Box display="flex" width="100%">
            {order.expectRefund && (
              <Box display="flex" width="100%">
                <Text textAlign="center" fontWeight="light">
                  EXPECTED REFUND DATE:
                </Text>
                <Text textAlign="center" fontWeight="bold">
                  {new Date(order.expectRefund)
                    .toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                    .toUpperCase()}
                </Text>
              </Box>
            )}
          </Box>
        )}

        <Box display="flex" width="100%">
          <Text textAlign="center" fontWeight="light">
            DATE:
          </Text>
          <Text textAlign="center" fontWeight="bold">
            {formatOrderDate(order).toUpperCase()} at{" "}
            {formatOrderDateShort(order)}
          </Text>
        </Box>

        <Box display="flex" width="100%">
          <Text textAlign="center" fontWeight="light">
            ORDER #:
          </Text>
          <Text textAlign="center" fontWeight="semibold">
            {order.shortCode}
          </Text>
        </Box>

        {/* <Box display="flex" width="100%">
          <Text textAlign="center" fontWeight="light">
            TOTAL:
          </Text>
          <Text textAlign="center" fontWeight="semibold">
            GHC{" "}
            {calculateCartTotal(order.cart)[0] +
              calculateCartTotal(order.cart)[1]}
          </Text>
        </Box> */}

        {/* {order.logistics === "delivery" && order.deliveryTotal && (
          <Box display="flex" width="100%">
            <Text textAlign="center" fontWeight="light">
              DELIVERY FEE:
            </Text>
            <Text textAlign="center" fontWeight="semibold">
              GHC {order.deliveryTotal}
            </Text>
          </Box>
        )} */}

        {order.status !== "CANCELLED" && order.customerRequestCancellation && (
          <Box display="flex" width="100%">
            <Text textAlign="center" fontWeight="light">
              CANCELLATION:
            </Text>
            <Text textAlign="center" fontWeight="semibold">
              REQUESTED
            </Text>
          </Box>
        )}

        {["READY"].includes(order.status) && order.logistics === "pickup" && (
          <Box mt={2} display="flex" justifyContent="center">
            <Text
              fontSize="x-large"
              backgroundColor="gray.300"
              textAlign="center"
              fontWeight="semibold"
              // p={1}
            >
              {order.challenge}
            </Text>
          </Box>
        )}
      </Box>

      <Divider my={2} />

      <Box mx={2}>
        <ButtonGroup
          variant="ghost"
          display="flex"
          my={2}
          size="lg"
          justifyContent="space-between"
        >
          <HelpModal order={order} />
          {["IN-PROGRESS"].includes(order.status) && order.deliveryTotal && (
            <PayDeliveryModal order={order} />
          )}
          {["PAID"].includes(order.status) &&
            !order.customerRequestCancellation && (
              <Button
                colorScheme="red"
                aria-label="Open Modal"
                isLoading={isSubmittingCancel}
                onClick={handleOrderRequestCancellation}
                // isDisabled={order.customerRequestCancellation}
                leftIcon={<FiSlash size="24px" />}
              >
                Cancel
              </Button>
            )}
          {["COMPLETED"].includes(order.status) && (
            <Button
              colorScheme="blue"
              variant="ghost"
              size="lg"
              aria-label="Open Modal"
              disabled={isSubmittingReview}
              loadingText="Submitting..."
              onClick={() => setShowInput(!showInput)}
              // disabled={order.status !== "PAID"}
              leftIcon={<FiFileText size="24px" />}
            >
              Review
            </Button>
          )}
          {/* {["COMPLETED", "CANCELLED"].includes(order.status) && (
            <Button
              colorScheme="blue"
              aria-label="Reorder"
              disabled
              leftIcon={<FiRotateCw size="24px" />}
            >
              Reorder
            </Button>
          )} */}
        </ButtonGroup>
      </Box>

      {showInput && (
        <>
          <Divider />
          <Box m={2}>
            <Box
              mb={2}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              width="100%"
            >
              <Text>Rate your experience with our service</Text>
              <ReactStars
                count={5}
                edit={!order.reviewRating}
                value={order.reviewRating}
                onChange={ratingChanged}
                size={36}
                activeColor="#ffd700"
              />
            </Box>
            <Textarea
              value={order.reviewText || reviewText}
              disabled={!!order.reviewText || isSubmittingReview}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Leave your review here..."
            />

            {!order.reviewText && (
              <Box width="100%" display="flex" justifyContent="center" mt={2}>
                <Button
                  aria-label="send message"
                  colorScheme="blue"
                  size="lg"
                  // variant="ghost"
                  disabled={
                    !deliveryStarRating ||
                    typeof deliveryStarRating !== "number"
                    // order.logistics === "delivery" &&
                    // deliveryStarRating !== 0
                  }
                  loadingText="Submitting..."
                  isLoading={isSubmittingReview}
                  onClick={handleOrderReviewSubmit}
                  leftIcon={<FiSend size="24px" />}
                >
                  Send
                </Button>
              </Box>
            )}
          </Box>
        </>
      )}

      <Box my={2}>
        <Accordion
          allowMultiple
          defaultIndex={
            ["PAID", "IN-PROGRESS", "READY"].includes(order.status) ? [0] : []
          }
        >
          <AccordionItem>
            <h2>
              <AccordionButton>
                <AccordionTitle notifications={notifications} />
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel
              borderBottomRadius="lg"
              maxHeight="200px"
              overflowX="scroll"
            >
              <UnorderedList>
                <SortedNotifications notifications={notifications} />
              </UnorderedList>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      <Box mt={1}>
        <Accordion allowMultiple>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="center">
                  Cart
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel borderBottomRadius="lg" px={0}>
              {order.discount && Object.keys(order.discount).length > 0 && (
                <Box
                  p={2}
                  display={"flex"}
                  justifyContent={"space-between"}
                  backgroundColor="blue.700"
                >
                  <Text fontWeight="black" color={"white"}>
                    {transform(order.discount)} DISCOUNT APPLIED
                  </Text>
                </Box>
              )}
              <Table
                width="100%"
                // variant="striped"
                padding={0}
                borderBottomRadius="lg"
              >
                <Tbody>
                  {order.cart.map((item, index) => (
                    <Tr key={index}>
                      <Td>
                        <Text fontWeight="semibold">{item.name}</Text>
                        {item.options &&
                          item.options.map((option_config, index) => {
                            return (
                              <Box ml={2} mt={1} key={index}>
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
                            {/* <UnorderedList spacing={0}> */}
                            {item.add.map((itemObj, index) => (
                              <Text key={index} fontWeight="semibold">
                                {itemObj.label}
                              </Text>
                              // <Box key={itemObj.id}>{itemObj.label}</ListItem>
                            ))}
                            {/* </UnorderedList> */}
                          </Box>
                        )}
                        {item.remove && item.remove.length > 0 && (
                          <Box ml={2} mt={1}>
                            <Text fontWeight="light">remove</Text>

                            {/* <UnorderedList spacing={0}> */}
                            {item.remove.map((itemObj, index) => (
                              <Text key={index} fontWeight="semibold">
                                {itemObj.label}
                              </Text>
                              // <ListItem key={itemObj.id}>{itemObj.label}</ListItem>
                            ))}
                            {/* </UnorderedList> */}
                          </Box>
                        )}
                      </Td>
                      <Td>{calculateCartItemPrice(item, order.discount)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  );
}

const SortedNotifications = ({ notifications }: { notifications: any }) => {
  const SortedNotifications = React.useCallback(() => {
    return notifications.sort((a, b) =>
      dayjs(b.time.toDate()).diff(a.time.toDate())
    );
  }, [notifications]);

  return SortedNotifications().map((notication, index) => (
    <Box key={index}>
      <p>{dayjs(notication.time.toDate()).format("DD/MM/YYYY h:mm:ss")}</p>
      {Array.isArray(notication.message) &&
        notication.message.map((message, index) => (
          <ListItem key={index}>{message}</ListItem>
        ))}
      <Divider my={2} />
    </Box>
  ));
};

const AccordionTitle = ({ notifications }: { notifications: any }) => {
  const useUpdateTitle = React.useCallback(() => {
    if (notifications && notifications.length > 1) {
      return `There are ${notifications.length} updates on this order`;
    } else if (notifications && notifications.length === 1) {
      return `There is ${notifications.length} update on this order`;
    } else if (notifications && notifications.length === 0) {
      return "There are no order updates yet";
    }
  }, [notifications]);
  return (
    <Box flex="1" textAlign="center">
      {useUpdateTitle()}
    </Box>
  );
};

const PayDeliveryModal = ({ order }: { order: UserOrderType }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const { authUser } = useAuth();
  // console.log({ authUser });
  // const { record } = useUserRecord({ currentUser: authUser });
  const [loading, setLoading] = React.useState(false);
  const getConfig = (): PaystackProps => ({
    email: order.customerEmail as string,
    amount: order.deliveryTotal * 100,
    currency: "GHS",
    phone: order.customerPhoneNumber as string,
    firstname: order.customerName ? order.customerName : "",
    metadata: {
      custom_fields: [
        {
          display_name: "client",
          variable_name: "client",
          value: process.env.NEXT_PUBLIC_MAJOR_CLIENT,
        },
        {
          display_name: "product",
          variable_name: "product",
          value: "major",
        },
        {
          display_name: "sub_product",
          variable_name: "sub_product",
          value: "major_manual_delivery",
        },
        {
          display_name: "order_reference",
          variable_name: "order_reference",
          value: order.id,
        },
        {
          display_name: "customer",
          variable_name: "customerId",
          value: authUser.uid,
        },
      ],
    },
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
  });
  const initializePayment = usePaystackPayment(getConfig());

  const handlePayOnline = () => {
    setLoading(true);
    onClose();
    initializePayment(
      () => {
        setLoading(false);

        // clearCart();
        // onClose();
        // toast({
        //   title: "Order successfully.",
        //   description: "Please wait while we process it.",
        //   status: "success",
        //   duration: null,
        //   isClosable: true,
        // });
      },
      () => {
        setLoading(false);
      }
    );
  };

  return (
    <>
      <Button
        colorScheme="green"
        variant="solid"
        size="lg"
        aria-label="Open Modal"
        isLoading={loading}
        disabled={order.deliveryTotalPaid}
        loadingText="Paying..."
        onClick={onOpen}
        // disabled={order.status !== "PAID"}
        leftIcon={<FiCreditCard size="24px" />}
      >
        {order.deliveryTotalPaid ? "Delivery paid" : "Pay delivery"}
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              How do you want to pay for delivery?
            </AlertDialogHeader>

            <AlertDialogBody>
              {/* Are you sure? You can not undo this action afterwards. */}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button variant="outline" ref={cancelRef} onClick={onClose}>
                Pay rider on delivery
              </Button>
              <Button
                variant="outline"
                colorScheme="green"
                onClick={handlePayOnline}
                ml={3}
              >
                Pay online now
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

function HelpModal({ order }: { order: UserOrderType }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { branch } = useBranch();
  return (
    <>
      <Button
        colorScheme="blue"
        aria-label="Open Modal"
        onClick={onOpen}
        leftIcon={<FiHelpCircle size="24px" />}
      >
        Help
      </Button>
      {/* <Button >Open Modal</Button> */}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>We are here to help</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {order.status === "READY" && (
              <Box>
                <UnorderedList>
                  <ListItem>
                    Your order is ready, this means we have completed your
                    order.
                  </ListItem>
                  {order.logistics == "pickup" && (
                    <ListItem>
                      Your order pick up code is{" "}
                      <strong>{order.challenge}</strong>
                    </ListItem>
                  )}
                  {order.logistics == "delivery" && (
                    <ListItem>
                      Your order is a delivery - a dispatch rider will contact
                      you shortly
                    </ListItem>
                  )}
                  <ListItem>
                    Please call us at {branch.phoneNumber} with anymore
                    questions.
                  </ListItem>
                </UnorderedList>
              </Box>
            )}
            {order.status === "PAID" && (
              <Box>
                <UnorderedList>
                  <ListItem>
                    Your order is paid, this means we have received your order
                    and will begin working on it shortly.
                  </ListItem>
                  <ListItem>
                    Your order will be updated with an ETA shortly.
                  </ListItem>
                  <ListItem>
                    While your order is in paid, you can request to cancel it.
                  </ListItem>
                  <ListItem>
                    Please call us at {branch.phoneNumber} with anymore
                    questions.
                  </ListItem>
                </UnorderedList>
              </Box>
            )}
            {order.status === "COMPLETED" && (
              <Box>
                <UnorderedList>
                  <ListItem>
                    Your order is completed, thank you for choosing wingman!
                  </ListItem>
                  <ListItem>
                    Enjoy your meal and please leave a review!
                  </ListItem>

                  <ListItem>
                    Please call us at {branch.phoneNumber} with anymore
                    questions
                  </ListItem>
                </UnorderedList>
              </Box>
            )}
            {order.status === "CANCELLED" && (
              <Box>
                <UnorderedList>
                  <ListItem>
                    Your order is cancelled, this means the order was not
                    accepted.
                  </ListItem>
                  <ListItem>Your order will be refunded</ListItem>
                  {order.expectRefund && (
                    <ListItem>
                      You will be refunded on{" "}
                      {new Date(order.expectRefund).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </ListItem>
                  )}
                  <ListItem>
                    Please call us at {branch.phoneNumber} with anymore
                    questions
                  </ListItem>
                </UnorderedList>
              </Box>
            )}
            {order.status === "IN-PROGRESS" && (
              <Box>
                <UnorderedList>
                  <ListItem>
                    Your order is in-progress, this means we are actively
                    working on it.
                  </ListItem>
                  <ListItem>Your order is a {order.logistics}</ListItem>
                  {order.logistics === "delivery" && (
                    <ListItem>
                      Your delivery fee is GHC {order.deliveryTotal}
                    </ListItem>
                  )}
                  <ListItem>
                    Delivery fee can be paid online now, or later to the rider
                    on delivery
                  </ListItem>
                  <ListItem>
                    Once the ETA is complete and your meal is ready, the status
                    will be updated to ready for {order.logistics}.
                  </ListItem>
                  <ListItem>
                    Please call us at {branch.phoneNumber} with anymore
                    questions
                  </ListItem>
                </UnorderedList>
              </Box>
            )}
            {/* Please call us at {branch.phoneNumber} */}
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button> */}
            {/* <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function BasicUsage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        colorScheme="blue"
        aria-label="Open Modal"
        onClick={onOpen}
        // disabled={order.status !== "PAID"}
        leftIcon={<AnnotationIcon width="24px" />}
      >
        Review
      </Button>
      {/* <Button >Open Modal</Button> */}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{/* <Lorem count={2} /> */}</ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default OrderCard;
