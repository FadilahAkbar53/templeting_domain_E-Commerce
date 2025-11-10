import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { RegionComponent, CartItem, Product } from "../types";

// REGION CONTEXT
type RegionRegistry = Record<string, RegionComponent[]>;

interface RegionContextType {
  regions: RegionRegistry;
  registerComponent: (
    regionName: string,
    id: string,
    component: React.ComponentType
  ) => void;
  unregisterComponent: (regionName: string, id: string) => void;
}

export const RegionContext = createContext<RegionContextType | undefined>(
  undefined
);

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [regions, setRegions] = useState<RegionRegistry>({});

  const registerComponent = useCallback(
    (regionName: string, id: string, component: React.ComponentType) => {
      setRegions((prevRegions) => {
        const regionComponents = prevRegions[regionName] || [];
        if (regionComponents.some((c) => c.id === id)) {
          return prevRegions; // Already registered
        }
        return {
          ...prevRegions,
          [regionName]: [...regionComponents, { id, component }],
        };
      });
    },
    []
  );

  const unregisterComponent = useCallback((regionName: string, id: string) => {
    setRegions((prevRegions) => {
      const regionComponents = prevRegions[regionName] || [];
      return {
        ...prevRegions,
        [regionName]: regionComponents.filter((c) => c.id !== id),
      };
    });
  }, []);

  return (
    <RegionContext.Provider
      value={{ regions, registerComponent, unregisterComponent }}
    >
      {children}
    </RegionContext.Provider>
  );
};

// CART CONTEXT
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const getCartItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const value = useMemo(
    () => ({ cart, addToCart, removeFromCart, getCartTotal, getCartItemCount }),
    [cart, addToCart, removeFromCart, getCartTotal, getCartItemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// WISHLIST CONTEXT
interface WishlistContextType {
  wishlist: string[]; // Store product IDs as strings
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isProductInWishlist: (productId: string) => boolean;
  getWishlistItemCount: () => number;
  fetchWishlist: () => Promise<void>;
  loading: boolean;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    try {
      const user = localStorage.getItem("user");
      if (!user) return;

      const userData = JSON.parse(user);
      const token = userData.token;

      setLoading(true);
      const response = await fetch("/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWishlist(data.map((product: any) => product._id));
      }
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = useCallback(async (productId: string) => {
    try {
      const user = localStorage.getItem("user");
      if (!user) return;

      const userData = JSON.parse(user);
      const token = userData.token;

      const response = await fetch(
        `/api/wishlist/${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWishlist(data.map((product: any) => product._id));
      }
    } catch (error) {
      console.error("Failed to add to wishlist", error);
    }
  }, []);

  const removeFromWishlist = useCallback(async (productId: string) => {
    try {
      const user = localStorage.getItem("user");
      if (!user) return;

      const userData = JSON.parse(user);
      const token = userData.token;

      const response = await fetch(
        `/api/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWishlist(data.map((product: any) => product._id));
      }
    } catch (error) {
      console.error("Failed to remove from wishlist", error);
    }
  }, []);

  const isProductInWishlist = useCallback(
    (productId: string) => {
      return wishlist.includes(productId);
    },
    [wishlist]
  );

  const getWishlistItemCount = useCallback(() => {
    return wishlist.length;
  }, [wishlist]);

  const value = useMemo(
    () => ({
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isProductInWishlist,
      getWishlistItemCount,
      fetchWishlist,
      loading,
    }),
    [
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isProductInWishlist,
      getWishlistItemCount,
      fetchWishlist,
      loading,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
