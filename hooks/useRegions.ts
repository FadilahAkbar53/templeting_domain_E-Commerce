import { useContext } from "react";
import { RegionContext, WishlistContext } from "../contexts/RegionContext";
import { CartContext } from "../contexts/CartContext";

export const useRegions = () => {
  const context = useContext(RegionContext);
  if (context === undefined) {
    throw new Error("useRegions must be used within a RegionProvider");
  }
  return context;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
