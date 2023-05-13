import { Box } from "@chakra-ui/layout";
import {
  Button,
  ButtonGroup,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { X } from "lucide-react";
import React, { createContext, useContext } from "react";

import { FiShoppingCart, FiTrash } from "react-icons/fi";
import { useGetStoreChoices } from "../../hooks/useGetStoreChoices";
import { createCartItem } from "../../major/helpers/cart";
import { useBranch } from "../../major/internals/BranchContext";
import { useCart } from "../../major/internals/CartContext";
import {
  choicesv2,
  ClientCatalogConfigType,
  ClientCatalogConfigType_Choices,
  ClientCatalogItemType,
} from "../../types/Client";

type Props = {
  menuItem: ClientCatalogItemType;
  options: ClientCatalogConfigType[];
  discounts: any[];
};

export const ProductCardFooter = ({ menuItem, options, discounts }: Props) => {
  const { branch } = useBranch();
  const isArrayAndIncludesBranch = (option) =>
    !Array.isArray(option.hide) || !option.hide.includes(branch.id);
  const hasConfig =
    options && options.filter(isArrayAndIncludesBranch).length > 0;

  const menuItemUnavaliable = !menuItem.available.includes(branch.id);

  const { addToCart, cartIncludes, removeItemFromCart } = useCart();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddToCartClick = () => {
    if (hasConfig) {
      onOpen();
    } else {
      addToCartDirectly();
    }
  };

  const addToCartDirectly = () => {
    const item = createCartItem({ menuItem, discounts });
    addToCart(item);
  };

  const calculatePriceWithDiscount = (menuItem, discounts) => {
    if (discounts.length === 0) {
      return menuItem.price;
    }
    const discount = discounts[0];
    if (discount.type === "PERCENTAGE") {
      const less = (menuItem.price * discount.discount) / 100;
      return menuItem.price - less;
    } else if (discount.type === "FIXED") {
      const less = discount.discount;
      return menuItem.price - less;
    }
  };

  return (
    <>
      <ButtonGroup
        isDisabled={branch && menuItemUnavaliable}
        isAttached
        size="lg"
        display="flex"
      >
        {cartIncludes(menuItem) && (
          <IconButton
            backgroundColor="gray.800"
            _hover={{
              backgroundColor: "gray.600",
            }}
            _active={{
              backgroundColor: "gray.600",
            }}
            isDisabled={false}
            boxShadow="md"
            aria-label="remove from cart"
            onClick={() => {
              removeItemFromCart(menuItem);
            }}
            icon={<FiTrash color="white" size="24px" />}
          />
        )}

        <Button
          backgroundColor="gray.900"
          _hover={{
            backgroundColor: "gray.600",
          }}
          _active={{
            backgroundColor: "gray.600",
          }}
          textColor={"white"}
          width={"100%"}
          boxShadow="md"
          onClick={handleAddToCartClick}
          // leftIcon={<FiShoppingCart size="24px" />}
          aria-label="Add to cart"
        >
          {menuItemUnavaliable
            ? "Sold Out"
            : "GHC " + calculatePriceWithDiscount(menuItem, discounts)}
        </Button>
      </ButtonGroup>

      {hasConfig && (
        <ProductConfigProvider
          discounts={discounts}
          options={options}
          menuItem={menuItem}
        >
          <ConfigDrawer isOpen={isOpen} onClose={onClose} />
        </ProductConfigProvider>
      )}
    </>
  );
};

const ConfigDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const btnRef = React.useRef();
  const {
    options,
    menuItem,
    discounts,
    add,
    setAdd,
    remove,
    setRemove,
    passesAddValidation,
    reset,
    passesRemoveValidation,
  } = useProductConfig();
  const { addToCart } = useCart();

  const handleSubmitItem = () => {
    const item = createCartItem({
      menuItem,
      add,
      remove,
      discounts,
    });
    addToCart(item);
    setAdd([]);
    setRemove([]);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={() => {
        reset();
        onClose();
      }}
      size="md"
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        {/* <DrawerCloseButton size="lg" /> */}
        <DrawerHeader className="primaryFont">
          {menuItem.name} choices
        </DrawerHeader>
        <Divider />
        <DrawerBody p={0} className={"primaryFont"}>
          {options.map((configItem) => (
            <OptionsContainer key={configItem.id} configItem={configItem} />
          ))}
        </DrawerBody>

        <Divider />
        <DrawerFooter p={1} className={"primaryFont"}>
          <ButtonGroup width="100%">
            <IconButton
              onClick={onClose}
              size="lg"
              variant={"outline"}
              icon={<X size={"24px"} />}
              aria-label={""}
              // width="100%"
            />
            <Button
              size="lg"
              isDisabled={!passesAddValidation() || !passesRemoveValidation()}
              backgroundColor="gray.900"
              _hover={{
                backgroundColor: "gray.600",
              }}
              _active={{
                backgroundColor: "gray.600",
              }}
              width={"100%"}
              onClick={handleSubmitItem}
              type="submit"
              textColor={"white"}
              boxShadow="md"
              leftIcon={<FiShoppingCart size="24px" />}
            >
              ADD TO CART
            </Button>
          </ButtonGroup>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const OptionsContainer = ({
  configItem,
}: {
  configItem: ClientCatalogConfigType;
}) => {
  return (
    <Box mb={2}>
      <Box
        fontWeight={"bold"}
        textColor={"white"}
        textAlign={"center"}
        backgroundColor={"gray.900"}
        p={2}
        mb={2}
      >
        {configItem.isRequired && "(required) "}
        {configItem.label ? configItem.label : `${configItem.type} `}{" "}
        {!!configItem.value && ` (+ GHC ${configItem.value})`}
        {configItem.limit !== 0 && ` (${configItem.limit} choice limit)`}{" "}
      </Box>

      <VStack mx={2}>
        {configItem.choices.map((choice) => (
          <LiveButton key={choice.id} configItem={configItem} choice={choice} />
        ))}
      </VStack>
    </Box>
  );
};

const LiveButton = ({
  choice,
  configItem,
}: {
  choice: choicesv2;
  configItem: ClientCatalogConfigType;
}) => {
  const { loading, choice: choice_config } = useGetStoreChoices(
    process.env.NEXT_PUBLIC_MAJOR_CLIENT,
    choice.id
  );
  const { branch } = useBranch();
  const { toggle } = useProductConfig();
  const { add, setAdd, remove, setRemove, isChoiceSelected } =
    useProductConfig();

  const selected = isChoiceSelected(configItem, choice_config);

  const price = React.useMemo(() => {
    if (!!configItem.value) {
      return null;
    } else if (choice.value > 0) {
      return `(${configItem.type === "ADD" ? "+" : "-"} GHC ${choice.value})`;
    }
  }, [choice.value, configItem.value, configItem.type]);

  if (choice_config && !choice_config.available.includes(branch.id)) {
    return null;
  }

  return (
    <Button
      width={"100%"}
      boxShadow={"sm"}
      onClick={() => {
        toggle(configItem, choice);
      }}
      colorScheme={selected ? "green" : "gray"}
      variant={selected ? "solid" : "outline"}
      isLoading={loading}
      loadingText={"Please wait..."}
    >
      {choice.label} {price}
    </Button>
  );
};

const ProductConfigContext = createContext<{
  options: ClientCatalogConfigType[];
  menuItem: ClientCatalogItemType;
  discounts: any[];
  reset: () => void;
  toggle: (item: ClientCatalogConfigType, choice: choicesv2) => void;
  add: choicesv2[];
  setAdd: React.Dispatch<React.SetStateAction<choicesv2[]>>;
  remove: choicesv2[];
  setRemove: React.Dispatch<React.SetStateAction<choicesv2[]>>;
  passesRemoveValidation: () => boolean;
  passesAddValidation: () => boolean;
  isChoiceSelected: (
    item: ClientCatalogConfigType,
    choice: ClientCatalogConfigType_Choices
  ) => boolean;
}>({
  options: [],
  toggle: () => {},
  menuItem: null,
  discounts: [],
  add: [],
  setAdd: () => {},
  remove: [],
  setRemove: () => {},
  passesRemoveValidation: () => false,
  passesAddValidation: () => false,
  reset: () => {},
  isChoiceSelected: () => false,
});

const ProductConfigProvider = ({
  children,
  options,
  menuItem,
  discounts,
}: {
  children: any;
  options: ClientCatalogConfigType[];
  menuItem: ClientCatalogItemType;
  discounts: any[];
}) => {
  const { branch } = useBranch();
  const [add, setAdd] = React.useState<choicesv2[]>([]);
  const [remove, setRemove] = React.useState<choicesv2[]>([]);
  const optionIsVisible = (option) => !option.hide?.includes(branch.id);
  const orderedOptions = (a, b) => a.order - b.order;
  const relevantOptions = options.filter(optionIsVisible).sort(orderedOptions);

  const passesAddValidation = React.useCallback(() => {
    const optionsWithLimits = (option) =>
      option.type === "ADD" && option.limit && option.limit > 0;
    const addLimitOptions = relevantOptions.filter(optionsWithLimits);
    // console.log({ addLimitOptions });

    const optionsRequired = (option) =>
      option.type === "ADD" && option.isRequired;
    const addRequiredOptions = relevantOptions.filter(optionsRequired);
    // console.log({ addRequiredOptions });

    const addSelectionCount = add.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.ref]: prev[curr.ref] ? prev[curr.ref] + 1 : 1,
      }),
      {} as any
    );

    // console.log({
    //   addSelectionCount,
    // });

    const hasItemWithinLimit = (item) => {
      const entry = addSelectionCount[item.id];
      if (entry) {
        return addSelectionCount[item.id] <= item.limit;
      } else {
        return true;
      }
    };

    const hasItemPresent = (item) =>
      Object.keys(addSelectionCount).includes(item.id);

    const passesAddLimit =
      addLimitOptions.length === 0
        ? true
        : addLimitOptions.every(hasItemWithinLimit);

    const passesRequired =
      addRequiredOptions.length === 0
        ? true
        : addRequiredOptions.every(hasItemPresent);
    // console.log({ passesAddLimit, passesRequired });

    return passesAddLimit && passesRequired;
  }, [add, relevantOptions]);

  const passesRemoveValidation = React.useCallback(() => {
    const optionsWithLimits = (option) =>
      option.type === "REMOVE" && option.limit && option.limit > 0;

    const optionsRequired = (option) =>
      option.type === "REMOVE" && option.isRequired;

    const removeLimitOptions = options.filter(optionsWithLimits);

    const removeRequiredOptions = options.filter(optionsRequired);

    const removeSelectionCount = remove.reduce(
      (prev, curr) => ({
        ...prev,
        [curr.ref]: prev[curr.ref] ? prev[curr.ref] + 1 : 1,
      }),
      {} as any
    );

    const hasItemWithinLimit = (item) =>
      removeSelectionCount[item.id] &&
      removeSelectionCount[item.id] <= item.limit;

    const hasItemPresent = (item) =>
      Object.keys(removeSelectionCount).includes(item.id);

    const passesRemoveLimit =
      removeLimitOptions.length === 0
        ? true
        : removeLimitOptions.length > 0 &&
          removeLimitOptions.every(hasItemWithinLimit);

    const passesRequired =
      removeLimitOptions.length === 0
        ? true
        : removeRequiredOptions.length > 0 &&
          removeRequiredOptions.every(hasItemPresent);

    return passesRemoveLimit && passesRequired;
  }, [remove, options]);

  const reset = () => {
    setAdd([]);
    setRemove([]);
  };

  const isChoiceSelected = (
    item: ClientCatalogConfigType,
    choice: choicesv2
  ) => {
    if (item.type === "ADD") {
      return !!(
        add &&
        add.find((config) => config.ref === item.id && config.id === choice.id)
      );
      // return !!(add && add.find((config) => config.ref === choice_config.id));
    } else if (item.type === "REMOVE") {
      return !!(
        remove &&
        remove.find(
          (config) => config.ref === item.id && config.id === choice.id
        )
      );
    }
  };

  const toggle = (item: ClientCatalogConfigType, choice: choicesv2) => {
    // console.log({ item, choice });
    if (isChoiceSelected(item, choice)) {
      if (item.type === "ADD") {
        setAdd(add.filter((addObj) => addObj.id !== choice.id));
      } else {
        setRemove(remove.filter((removeObj) => removeObj.id !== choice.id));
      }
    } else {
      if (item.type === "ADD") {
        const entry = { ...choice, ref: item.id } as choicesv2;
        if (item.value) {
          entry.refPriceOverride = item.value;
        }
        setAdd([...add, entry]);
      } else {
        setRemove([...remove, { ...choice, ref: item.id }]);
      }
    }
  };

  // console.log({ add });

  const context = {
    options: relevantOptions,
    passesAddValidation,
    passesRemoveValidation,
    toggle,
    menuItem,
    discounts,
    add,
    setAdd,
    remove,
    setRemove,
    reset,
    isChoiceSelected,
    // passesAddValidation,passesRemoveValidation
  };

  return (
    <ProductConfigContext.Provider value={context}>
      {children}
    </ProductConfigContext.Provider>
  );
};
// custom hook to use the authUserContext and access authUser and loading
const useProductConfig = () => useContext(ProductConfigContext);

export default ProductCardFooter;
