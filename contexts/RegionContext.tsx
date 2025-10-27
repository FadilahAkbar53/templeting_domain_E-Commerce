import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { RegionComponent, CartItem, Product } from '../types';

// REGION CONTEXT
type RegionRegistry = Record<string, RegionComponent[]>;

interface RegionContextType {
  regions: RegionRegistry;
  registerComponent: (regionName: string, id: string, component: React.ComponentType) => void;
  unregisterComponent: (regionName: string, id: string) => void;
}

export const RegionContext = createContext<RegionContextType | undefined>(undefined);

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [regions, setRegions] = useState<RegionRegistry>({});

  const registerComponent = useCallback((regionName: string, id: string, component: React.ComponentType) => {
    setRegions(prevRegions => {
      const regionComponents = prevRegions[regionName] || [];
      if (regionComponents.some(c => c.id === id)) {
        return prevRegions; // Already registered
      }
      return {
        ...prevRegions,
        [regionName]: [...regionComponents, { id, component }],
      };
    });
  }, []);

  const unregisterComponent = useCallback((regionName: string, id: string) => {
    setRegions(prevRegions => {
      const regionComponents = prevRegions[regionName] || [];
      return {
        ...prevRegions,
        [regionName]: regionComponents.filter(c => c.id !== id),
      };
    });
  }, []);

  return (
    <RegionContext.Provider value={{ regions, registerComponent, unregisterComponent }}>
      {children}
    </RegionContext.Provider>
  );
};


// CART CONTEXT
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = useCallback((product: Product, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prevCart, { ...product, quantity }];
        });
    }, []);

    const removeFromCart = useCallback((productId: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    }, []);

    const getCartTotal = useCallback(() => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }, [cart]);
    
    const getCartItemCount = useCallback(() => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    }, [cart]);

    const value = useMemo(() => ({ cart, addToCart, removeFromCart, getCartTotal, getCartItemCount }), [cart, addToCart, removeFromCart, getCartTotal, getCartItemCount]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}


// WISHLIST CONTEXT
interface WishlistContextType {
    wishlist: number[];
    addToWishlist: (productId: number) => void;
    removeFromWishlist: (productId: number) => void;
    isProductInWishlist: (productId: number) => boolean;
    getWishlistItemCount: () => number;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useState<number[]>(() => {
        try {
            const item = window.localStorage.getItem('wishlist');
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error("Failed to parse wishlist from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem('wishlist', JSON.stringify(wishlist));
        } catch (error) {
            console.error("Failed to save wishlist to localStorage", error);
        }
    }, [wishlist]);

    const addToWishlist = useCallback((productId: number) => {
        setWishlist(prev => [...prev, productId]);
    }, []);

    const removeFromWishlist = useCallback((productId: number) => {
        setWishlist(prev => prev.filter(id => id !== productId));
    }, []);
    
    const isProductInWishlist = useCallback((productId: number) => {
        return wishlist.includes(productId);
    }, [wishlist]);

    const getWishlistItemCount = useCallback(() => {
        return wishlist.length;
    }, [wishlist]);

    const value = useMemo(() => ({
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isProductInWishlist,
        getWishlistItemCount
    }), [wishlist, addToWishlist, removeFromWishlist, isProductInWishlist, getWishlistItemCount]);

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    )
}