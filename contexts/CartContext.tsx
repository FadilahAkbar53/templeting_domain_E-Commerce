import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { CartItem, Product } from "../types";

export interface CartItemWithSelection extends CartItem {
  selected: boolean;
}

interface CartContextType {
  cart: CartItemWithSelection[];
  addToCart: (product: Product, quantity?: number, size?: number) => void;
  removeFromCart: (productId: string, size?: number) => void;
  updateQuantity: (productId: string, quantity: number, size?: number) => void;
  toggleSelectItem: (productId: string, size?: number) => void;
  toggleSelectAll: () => void;
  clearSelectedItems: () => void;
  getCartTotal: () => number;
  getSelectedTotal: () => number;
  getCartItemCount: () => number;
  getSelectedItemCount: () => number;
  getSelectedItems: () => CartItemWithSelection[];
  allSelected: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItemWithSelection[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback(
    (product: Product, quantity = 1, size?: number) => {
      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item._id === product._id && item.size === size
        );

        if (existingItem) {
          return prevCart.map((item) =>
            item._id === product._id && item.size === size
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        return [
          ...prevCart,
          {
            ...product,
            quantity,
            size: size || product.sizes[0],
            selected: true, // Default selected when added
          },
        ];
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: string, size?: number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item._id === productId && item.size === size))
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, size?: number) => {
      if (quantity <= 0) {
        removeFromCart(productId, size);
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item._id === productId && item.size === size
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeFromCart]
  );

  const toggleSelectItem = useCallback((productId: string, size?: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId && item.size === size
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setCart((prevCart) => {
      const allSelected = prevCart.every((item) => item.selected);
      return prevCart.map((item) => ({ ...item, selected: !allSelected }));
    });
  }, []);

  const clearSelectedItems = useCallback(() => {
    setCart((prevCart) => prevCart.filter((item) => !item.selected));
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const getSelectedTotal = useCallback(() => {
    return cart
      .filter((item) => item.selected)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const getCartItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const getSelectedItemCount = useCallback(() => {
    return cart.filter((item) => item.selected).length;
  }, [cart]);

  const getSelectedItems = useCallback(() => {
    return cart.filter((item) => item.selected);
  }, [cart]);

  const allSelected = useMemo(() => {
    return cart.length > 0 && cart.every((item) => item.selected);
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleSelectItem,
      toggleSelectAll,
      clearSelectedItems,
      getCartTotal,
      getSelectedTotal,
      getCartItemCount,
      getSelectedItemCount,
      getSelectedItems,
      allSelected,
    }),
    [
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleSelectItem,
      toggleSelectAll,
      clearSelectedItems,
      getCartTotal,
      getSelectedTotal,
      getCartItemCount,
      getSelectedItemCount,
      getSelectedItems,
      allSelected,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
