import {
  Alert,
  AlertDescription,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  ScaleFade,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import PaystackPop from "@paystack/inline-js";
import va from "@vercel/analytics";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { FiShoppingCart, FiX } from "react-icons/fi";
import { firestore, timestamp } from "../../firebase";
import { useGetStore } from "../../hooks/useGetStore";
import useUserLocations from "../../hooks/useUserLocations";
import {
  calculateCartItemPrice,
  calculateCartTotal,
} from "../../major/helpers/cart";
import { useBranch } from "../../major/internals/BranchContext";
import { useCart } from "../../major/internals/CartContext";
import { useUserRecord } from "../../major/internals/RecordContext";
import { useUserRewards } from "../../major/internals/RewardsContext";
import { useAuth } from "../../major/internals/UserContext";
import { charka_dark_color_2 } from "../../shared/Header";
import { PageLoader } from "../../shared/PageLoader";
import { UserOrderType } from "../../types/User";
import { AddEmailToAccount } from "../AddEmailToAccount";
import { CartList } from "../CartList";
import MapDeliveryInput from "../MapDeliveryInput";
import OrderCardPreview from "../OrderCardPreview";
import { SignupForm } from "../SignupForm";
import { OfflineAlert } from "../StoreStatus";
import { transform } from "../UserCentric";
import Logistics, { LogisticsLocation } from "./Tanels/Logistics";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export type logisticsTypes = "delivery" | "pickup";

export enum CartActionKind {
  SET_LOGISTICS = "SET_LOGISTICS",
  SET_LOCATION = "SET_LOCATION",
  SET_NOTE = "SET_NOTE",
  RESET = "RESET",
  RESET_LOCATION = "RESET_LOCATION",
  NEW_LOCATION = "NEW_LOCATION",
  SET_LOCATION_TEXT = "SET_LOCATION_TEXT",
  SET_DISCOUNT = "SET_DISCOUNT",
  CLEAR_DISCOUNT = "CLEAR_DISCOUNT",
}

export type CartAction =
  | {
      type: CartActionKind.SET_LOCATION;
      payload: {
        lat: number;
        lng: number;
        text: string;
      };
    }
  | {
      type: CartActionKind.SET_LOGISTICS;
      payload: {
        logistics: logisticsTypes;
      };
    }
  | {
      type: CartActionKind.SET_NOTE;
      payload: {
        note: string;
      };
    }
  | {
      type: CartActionKind.RESET;
      payload: any;
    }
  | {
      type: CartActionKind.RESET_LOCATION;
      payload: null;
    }
  | {
      type: CartActionKind.NEW_LOCATION;
      payload: {
        newLocation: boolean;
      };
    }
  | {
      type: CartActionKind.SET_LOCATION_TEXT;
      payload: {
        text: string;
      };
    }
  | {
      type: CartActionKind.SET_DISCOUNT;
      payload: {
        discount: number;
        type: string;
      };
    }
  | {
      type: CartActionKind.CLEAR_DISCOUNT;
      payload: null;
    };

export type LogisticsStateType = {
  logistics_type: logisticsTypes;
  location: {
    lat: any;
    lng: any;
    text: string;
  };
  note: string;
  newLocation: boolean;
  discount?: {
    discount: number;
    type: string;
  };
};

const logisticsState: LogisticsStateType = {
  logistics_type: null,
  location: {
    lat: null,
    lng: null,
    text: "",
  },
  note: "",
  newLocation: false,
};

const reducer = (state: LogisticsStateType, action: CartAction) => {
  const { type, payload } = action;
  switch (action.type) {
    case "SET_LOGISTICS":
      if (!("logistics" in payload)) {
        throw new Error("payload.logistics not found");
      }
      return {
        ...state,
        logistics_type: payload.logistics,
      };
    case "SET_LOCATION":
      if (!("lat" in payload)) {
        throw new Error("payload.lat not found");
      }
      return {
        ...state,
        location: {
          lat: payload.lat,
          lng: payload.lng,
          text: payload.text,
        },
      };
    case "SET_NOTE":
      if (!("note" in payload)) {
        throw new Error("payload.note not found");
      }
      return {
        ...state,
        note: payload.note,
      };
    case "RESET":
      return {
        ...logisticsState,
        ...payload,
      };
    case "RESET_LOCATION":
      return {
        ...state,
        location: {
          lat: null,
          lng: null,
          text: "",
        },
      };
    case "NEW_LOCATION":
      if (!("newLocation" in payload)) {
        throw new Error("payload.newLocation not found");
      }
      return {
        ...state,
        newLocation: payload.newLocation,
      };
    case "SET_LOCATION_TEXT":
      if (!("text" in payload)) {
        throw new Error("payload.text not found");
      }
      return {
        ...state,
        location: { ...state.location, text: payload.text },
      };
    case "SET_DISCOUNT":
      if (!("discount" in payload)) {
        throw new Error("payload.discount not found");
      }
      if (!("type" in payload)) {
        throw new Error("payload.type not found");
      }
      return {
        ...state,
        discount: { ...payload },
      };
    case "CLEAR_DISCOUNT":
      const copy = { ...state };
      delete copy.discount;
      return {
        ...copy,
      };
    default:
      throw new Error();
  }
};

export const CartDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { authUser } = useAuth();
  const { record } = useUserRecord();
  const { store } = useGetStore();
  const { rewards } = useUserRewards();
  const { cart } = useCart();
  const [tabIndex, setTabIndex] = useState(0);
  const [state, dispatch] = useReducer(reducer, logisticsState);
  const { branch, branches } = useBranch();
  const [isOffline, setIsOffline] = useState(false);
  const value = useColorModeValue("white", charka_dark_color_2);

  useEffect(() => {
    const selectedBranch = branches.find(
      (local_branch) => local_branch.id === branch.id
    );

    if (selectedBranch) {
      setIsOffline(!selectedBranch.online);
    }
  }, [branches, branch]);

  const forward = () => {
    setTabIndex(tabIndex + 1);
  };

  const back = () => {
    setTabIndex(tabIndex - 1);
  };

  const onCartDrawerClose = () => {
    dispatch({
      type: CartActionKind.RESET,
      payload: { discount: { ...state.discount } },
    });
    setTabIndex(0);
    onClose();
  };

  useEffect(() => {
    const selectedBranch = branches.find(
      (local_branch) => local_branch.id === branch.id
    );

    if (selectedBranch) {
      setIsOffline(!selectedBranch.online);
    }
  }, [branches, branch]);

  useEffect(() => {
    if (rewards && rewards.checkout_discount) {
      dispatch({
        type: CartActionKind.SET_DISCOUNT,
        payload: rewards.checkout_discount,
      });
    } else {
      dispatch({
        type: CartActionKind.CLEAR_DISCOUNT,
        payload: null,
      });
    }
  }, [rewards]);

  const showCheckoutPage = useCallback(() => {
    const selectedBranch =
      branches &&
      branches.find((local_branch) => local_branch.id === branch.id);

    return selectedBranch?.online;
  }, [branch.id, branches, cart.length]);

  const showAddEmailSection = useCallback(() => {
    return authUser && record && record.email === "";
  }, [authUser, record]);

  const showLogisticsSection = useCallback(() => {
    return authUser && record && record.email !== "";
  }, [authUser, record]);

  const showGoogleMaps = useCallback(() => {
    return (
      state.logistics_type === "delivery" &&
      state.location.lat !== null &&
      state.location.lng !== null &&
      state.newLocation
    );
  }, [state]);

  const emptyCart = useCallback(() => {
    return cart.length === 0;
  }, [cart]);

  const showLoader = useCallback(() => {
    return authUser && !record;
  }, [record, authUser]);

  return (
    <>
      <ScaleFade initialScale={0.7} unmountOnExit in={!emptyCart()}>
        <Button
          disabled={!store}
          aria-label="cart"
          colorScheme="green"
          boxShadow={"lg"}
          variant="solid"
          ml={2}
          onClick={onOpen}
          leftIcon={<FiShoppingCart size="24px" />}
        >
          Pay
        </Button>
      </ScaleFade>

      <Drawer
        isOpen={isOpen}
        placement="right"
        trapFocus={false}
        size="md"
        onClose={onCartDrawerClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody padding={0}>
            <Tabs index={tabIndex} isLazy>
              <TabPanels>
                <TabPanel padding={0}>
                  {isOffline && (
                    <>
                      <OfflineAlert />
                      <Divider />
                    </>
                  )}
                  {showCheckoutPage() && (
                    <>
                      {rewards && rewards.checkout_discount && (
                        <Box
                          p={2}
                          zIndex={3}
                          position={"sticky"}
                          top={0}
                          display={"flex"}
                          justifyContent={"space-between"}
                          backgroundColor="blue.700"
                        >
                          <Text fontWeight="black" color={"white"}>
                            {transform(rewards.checkout_discount)} DISCOUNT
                            APPLIED
                          </Text>
                        </Box>
                      )}
                      {/* {offline && (
                        <Alert status="info">
                          <AlertIcon />
                          Your internet connection is weak.
                        </Alert>
                      )} */}
                      {!authUser && (
                        <Box
                          minHeight={"281px"}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                        >
                          <SignupForm />
                          {/* <Divider /> */}
                        </Box>
                      )}
                      {showLoader() && (
                        <Box height={"250px"}>
                          <PageLoader />
                        </Box>
                      )}
                      {showAddEmailSection() && (
                        <AddEmailToAccount authUser={authUser} />
                      )}
                      {showLogisticsSection() && (
                        <Box
                          position={"sticky"}
                          top={"0px"}
                          backgroundColor={value}
                          zIndex={3}
                        >
                          <Logistics
                            dispatch={dispatch}
                            store={store}
                            state={state as LogisticsStateType}
                          />

                          <Collapse
                            unmountOnExit
                            in={state.logistics_type === "delivery"}
                            animateOpacity
                          >
                            <Box width={"100%"} bottom={"0"}>
                              <LogisticsLocation
                                dispatch={dispatch}
                                state={state}
                              />

                              <Collapse
                                unmountOnExit
                                in={showGoogleMaps()}
                                animateOpacity
                              >
                                <>
                                  <MapDeliveryInput
                                    state={state as LogisticsStateType}
                                    dispatch={dispatch}
                                  />
                                  <Divider />
                                </>
                              </Collapse>
                            </Box>
                          </Collapse>
                        </Box>
                      )}
                    </>
                  )}
                  <CartList rewards={rewards} back={onCartDrawerClose} />
                </TabPanel>

                <TabPanel padding={0}>
                  {tabIndex === 1 && (
                    <Box>
                      <SaveLocation state={state} />
                      <Divider />
                      <OrderCardPreview user={authUser} />
                    </Box>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </DrawerBody>

          <DrawerFooter p={0}>
            <Box width={"100%"}>
              {tabIndex === 0 && (
                <Box>
                  {showCheckoutPage() && (
                    <Box>
                      <Divider />

                      <Box m={2}>
                        <Textarea
                          style={{ resize: "none" }}
                          value={state.note}
                          onChange={(e) => {
                            let inputValue = e.target.value;
                            dispatch({
                              type: CartActionKind.SET_NOTE,
                              payload: { note: inputValue },
                            });
                          }}
                          maxLength={250}
                          placeholder="Leave us a note about your order..."
                        />
                      </Box>
                      <Divider />

                      <Box>
                        <Flex m={2}>
                          <IconButton
                            icon={<FiX size={"24px"} />}
                            size={"lg"}
                            aria-label={"Close drawer"}
                            mr={2}
                            onClick={onCartDrawerClose}
                          />
                          <PayButton
                            forward={forward}
                            state={state as LogisticsStateType}
                          />
                        </Flex>
                        <Alert status="info">
                          {/* <AlertIcon /> */}
                          <AlertDescription fontSize="xs">
                            {" "}
                            Order includes processing fees.
                            {state.logistics_type === "delivery" &&
                              ` Kindly note
 delivery fee will be charged separately and paid
directly to the rider on delivery.`}
                          </AlertDescription>
                        </Alert>
                      </Box>
                    </Box>
                  )}

                  {!showCheckoutPage() && isOffline && (
                    <Box m={2}>
                      <Button
                        leftIcon={<FiX size={"24px"} />}
                        width={"100%"}
                        onClick={onCartDrawerClose}
                      >
                        Back
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
              {tabIndex === 1 && (
                <Button
                  leftIcon={<FiX size={"24px"} />}
                  size={"lg"}
                  aria-label={"Close drawer"}
                  m={2}
                  width={"100%"}
                  onClick={onCartDrawerClose}
                >
                  Close
                </Button>
              )}
            </Box>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const SaveLocation = ({
  state,
}: {
  state: {
    logistics_type: logisticsTypes;
    location: {
      lat: any;
      lng: any;
      text: any;
    };
    note: string;
    newLocation: boolean;
  };
}) => {
  const { authUser } = useAuth();
  const { loading, locations } = useUserLocations({ authUser });

  const toast = useToast();
  const [value, setValue] = useState(state.location.text);
  const [hide, setHide] = useState(false);
  const handleClick = () => setValue("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSave = () => {
    setIsLoading(true);

    firestore
      .collection("users")
      .doc(authUser.uid)
      .collection("locations")
      .add({
        label: value,
        lat: state.location.lat,
        lng: state.location.lng,
      })
      .then(() => {
        va.track("LocationSaveSuccess");
        toast({
          title: "Location Saved",
          description:
            "You will be able to use this location on your next checkout!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setHide(true);
      })
      .catch((error) => {
        va.track("LocationSaveFailed");
        toast({
          title: "Failed to save location",
          description: "Please try again!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });

    // firebase.firestore
  };

  if (!state.newLocation || loading || hide || locations.length === 5) {
    return <></>;
  }

  return (
    <Box mx={4} my={2}>
      <Box mb={2} backgroundColor="yellow.100" p={4}>
        <Text>Do you want to save this location?</Text>
      </Box>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          value={value}
          isDisabled={isLoading}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Name this location"
        />
        {value.length > 0 && (
          <InputRightElement width="4.5rem">
            <Button
              isDisabled={isLoading}
              h="1.75rem"
              size="sm"
              onClick={handleClick}
            >
              Reset
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
      <Box my={2}>
        <Button
          onClick={handleLocationSave}
          isLoading={isLoading}
          disabled={value.length === 0}
          width={"100%"}
        >
          Save Location
        </Button>
      </Box>
    </Box>
  );
};

const getRandomNumberBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const PayButton = ({
  forward,
  state,
}: // store
{
  // store: ClientType
  state: LogisticsStateType;
  forward: () => void;
}) => {
  const { cart, clearCart } = useCart();
  const { store } = useGetStore();
  const { authUser } = useAuth();
  const [orderLoading, setOrderLoading] = useState(false);
  const { record } = useUserRecord();
  const toast = useToast();
  const orderId = useRef(nanoid());
  const { branch, branches } = useBranch();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const selectedBranch = branches.find(
      (local_branch) => local_branch.id === branch.id
    );

    if (selectedBranch) {
      setIsOffline(!selectedBranch.online);
    }
  }, [branches, branch]);

  const [total, processing, deliveryFee] = calculateCartTotal(
    cart,
    state.discount
  );

  const paymentSuccess = () => {
    forward();
    clearCart();
  };

  const paymentFail = () => {
    orderId.current = nanoid();
  };

  const handlePayment = async () => {
    setOrderLoading(true);

    const order = {
      location: {
        lat: state.location.lat,
        lng: state.location.lng,
        text: state.location.text,
      },
      logistics: state.logistics_type,
      cart,
      total,
      customerNote: state.note,
      version: "v1",
      managed_delivery: false,
      branch: branch.id,
      branchName: branch.name,
      branchPhoneNumber: branch.phoneNumber,
      branchCoordinates: branch.coordinates,
      shortCode: getRandomNumberBetween(0, 9999),
      store: store.id,
      storeName: store.name,
      storeWebsite: store.website,
      storeAlphaSenderID: store.alphaSenderID,
      customerId: authUser.uid,
      customerEmail: record.email,
      customerName: record.name,
      customerPhoneNumber: record.phoneNumber,
      branchTextNotificationPhoneNumber: branch.textNotificationPhoneNumber,
      customerRequestCancellation: false,
      status: "IN-COMPLETE",
      channel: "WEB",
      challenge: Math.floor(1000 + Math.random() * 9000),
      createdAt: timestamp(),
    } as Partial<UserOrderType>;

    if (state.discount) {
      order.discount = state.discount;
    }

    const batch = firestore.batch();

    const storeOrderRef = firestore
      .collection("stores")
      .doc(process.env.NEXT_PUBLIC_MAJOR_CLIENT)
      .collection("orders")
      .doc(orderId.current);
    batch.set(storeOrderRef, {
      ...order,
    });

    const userOrderRef = firestore
      .collection("users")
      .doc(authUser.uid)
      .collection("orders")
      .doc(orderId.current);

    batch.set(userOrderRef, {
      ...order,
    });

    batch
      .commit()
      .then(() => {
        const paystack = new PaystackPop();

        paystack.newTransaction({
          email: record?.email,
          amount: total * 100,
          subaccount: process.env.NEXT_PUBLIC_MAJOR_SUBACCOUNT,
          currency: "GHS",
          ref: orderId.current,
          phone: record?.phoneNumber,
          firstname: record?.name,
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
                display_name: "customer",
                variable_name: "customerId",
                value: authUser?.uid,
              },
              {
                display_name: "delievry",
                variable_name: "delievry",
                value: state.logistics_type === "delivery",
              },
              {
                display_name: "tally_add_points",
                variable_name: "tally_add_points",
                value: cart.reduce(
                  (prev, curr) => prev + calculateCartItemPrice(curr),
                  0
                ),
              },
            ],
          },
          key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
          // label: "Optional string that replaces customer email"
          onCancel: paymentFail,
          onSuccess: paymentSuccess,
        });
        va.track("cartSuccess");
      })
      .catch((error) => {
        va.track("cartFail");
        // console.log({ error });
        toast({
          title: "We failed to place your order.",
          description:
            "Something went wrong placing your order. Please try again or contact the resturant directly",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      })
      .finally(() => {
        setOrderLoading(false);
      });
  };

  if (isOffline) {
    return <></>;
  }

  return (
    <Button
      width={"100%"}
      size="lg"
      variant="solid"
      loadingText={
        !authUser
          ? "Please Login..."
          : authUser && !record
          ? "Fetching Your Profile..."
          : record?.name === "" || record?.email === ""
          ? "Complete Profile..."
          : state.logistics_type === null
          ? "Select Pick Up or Delivery"
          : state.logistics_type === "delivery" &&
            (state.location.lat === null || state.location.lng === null)
          ? "Enter Location..."
          : "Loading..."
      }
      isLoading={
        !authUser ||
        (authUser && !record) ||
        orderLoading ||
        state.logistics_type === null ||
        record?.name === "" ||
        record?.email === "" ||
        (state.logistics_type === "delivery" &&
          (state.location.lat === null || state.location.lng === null))
      }
      isDisabled={cart.length === 0 || !state.logistics_type}
      onClick={handlePayment}
      colorScheme="green"
      // m={2}
    >
      Place Order - GHC {total}
    </Button>
  );
};
