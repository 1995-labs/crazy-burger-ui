import va from "@vercel/analytics";
import React, { createContext, useContext, useState } from "react";

import { CartItemType, ClientCatalogItemType } from "../../types/Client";

export type CartContextType = {
  cart: CartOrderType;
  addToCart: (product: CartItemType) => void;
  removeFromCart: (product: CartItemType) => void;
  clearCart: () => void;
  cartIncludes: (product: ClientCatalogItemType) => boolean;
  removeItemFromCart: (product: ClientCatalogItemType) => void;
};

export type CartMenuType = {
  cartId: string;
  name: string;
  id: string;
  price: number;
};

export type CartOrderType = CartItemType[];

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  cartIncludes: () => false,
  removeItemFromCart: () => {},
});

export const useCart = () => useContext(CartContext);

type ProviderType = {
  children: React.ReactNode;
};

export function CartProvider({ children }: ProviderType) {
  const [cart, setCart] = useState<CartItemType[]>([]);

  const clearCart = () => setCart([]);

  const addToCart = (product: CartItemType) => {
    setCart([...cart, product]);
    va.track("addToCart", { name: product.name });
  };

  const removeFromCart = (product: CartItemType) => {
    setCart(cart.filter((item) => item.cartId !== product.cartId));
    va.track("removeFromCart", { name: product.name });
  };

  const cartIncludes = (product: ClientCatalogItemType) =>
    cart.some((cartItem) => cartItem.id === product.id);

  const removeItemFromCart = (product: ClientCatalogItemType) => {
    const cartItem = cart.find((cartItem) => cartItem.id === product.id);

    if (cartItem) {
      setCart(
        cart.filter((cartItemRef) => cartItemRef.cartId !== cartItem.cartId)
      );
    }
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    cartIncludes,
    removeItemFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
