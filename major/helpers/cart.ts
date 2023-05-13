import { nanoid } from "nanoid";
import {
  CartItemType,
  choicesv2,
  ClientCatalogConfigType,
  ClientCatalogItemType,
} from "../../types/Client";
import { CartOrderType } from "../internals/CartContext";

type CustomItemProps = {
  menuItem: ClientCatalogItemType;
  options?: ClientCatalogConfigType[];
  // optionsMap?: {
  //   [id: string]: ClientCatalogConfigType_Choices;
  // };
  add?: choicesv2[];
  remove?: choicesv2[];
  discounts?: any[];
};

export const createCartItem = ({
  menuItem,
  add,
  remove,
  discounts,
}: CustomItemProps): CartItemType => {
  const initialItem: Partial<CartItemType> = {
    cartId: nanoid(),
    id: menuItem.id,
    name: menuItem.name,
    price: menuItem.price,
  };

  if (add) {
    const addConfigWithPriceOverride = add.filter(
      (item) => item.refPriceOverride
    );
    // console.log({ add, addConfigWithPriceOverride });
    initialItem.add = [];
    add.forEach((addConfig) => {
      const hasPriceOverride = addConfigWithPriceOverride
        .map((item) => item.id)
        .includes(addConfig.id);
      initialItem.add.push({
        id: addConfig.id,
        label: addConfig.label,
        value: hasPriceOverride ? 0 : addConfig.value,
      });
    });

    const uniquePriceOverrides = new Set(
      addConfigWithPriceOverride.map((item) => item.ref)
    );
    uniquePriceOverrides.forEach((priceOverride) => {
      initialItem.price += addConfigWithPriceOverride.find(
        (item) => item.ref === priceOverride
      ).refPriceOverride;
    });
    // console.log({ initialItem });
    // console.log({ addConfigWithPriceOverride, uniquePriceOverrides });
  }

  if (remove) {
    initialItem.remove = [];
    remove.forEach((removeConfig) => {
      initialItem.remove.push({
        id: removeConfig.id,
        label: removeConfig.label,
        value: removeConfig.value,
      });
    });
  }

  if (discounts.length > 0) {
    if (discounts[0].type === "PERCENTAGE") {
      initialItem.price =
        initialItem.price - initialItem.price * (discounts[0].discount / 100);
    } else if (discounts[0].type === "FIXED") {
      initialItem.price = initialItem.price - discounts[0].discount;
    }
  }

  return initialItem as CartItemType;
};

export const calculateCartItemPrice = (
  item: CartItemType,
  discounts?: {
    discount: number;
    type: string;
  }
) => {
  let basePrice = item.price;
  // console.log({ basePrice });

  if (item.options) {
    item.options.forEach((option) => {
      basePrice += option.choice.value;
    });
  }

  if (item.add) {
    item.add.forEach((addOption) => {
      basePrice += addOption.value;
    });
  }

  if (item.remove) {
    item.remove.forEach((removeOption) => {
      basePrice -= removeOption.value;
    });
  }

  return basePrice;
};

export const calculateCartTotal = (
  cart: CartOrderType,
  discounts?: {
    discount: number;
    type: string;
  }
): [total: number, processingFee: number, deliveryFee: number] => {
  let tally = 0;
  let processing = 0;
  let deliveryFee = 0;
  let total = 0;
  const paystackFee = 1.0195;

  cart.forEach((cartItem) => {
    let cartPrice = calculateCartItemPrice(cartItem);
    tally += cartPrice;
  });

  if (tally !== 0 && discounts) {
    let discount = 0;
    if (discounts.type === "PERCENTAGE") {
      discount = tally * (discounts.discount / 100);
    } else if (discounts.type === "FIXED") {
      discount = discounts.discount;
    }
    tally -= discount;
  }

  total = Math.ceil(tally * paystackFee);

  return [total, processing, deliveryFee];
};
