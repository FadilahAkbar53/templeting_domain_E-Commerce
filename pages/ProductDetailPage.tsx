import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../hooks/useRegions';
import { useWishlist } from '../hooks/useRegions';
import { formatCurrency } from '../services/exportService';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack }) => {
  const { addToCart } = useCart();
  const { isProductInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<number | null>(product.sizes.length > 0 ? product.sizes[0] : null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart(product, quantity);
    } else {
      alert("Please select a size.");
    }
  };

  const isLiked = isProductInWishlist(product._id);
  const toggleWishlist = () => {
      if (isLiked) {
          removeFromWishlist(product._id);
      } else {
          addToWishlist(product._id);
      }
  };

  return (
    <div>
      <button onClick={onBack} className="mb-8 flex items-center text-sm font-medium text-theme-text-muted hover:text-theme-text-base">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Products
      </button>

      <div className="bg-theme-bg-primary shadow-lg rounded-xl p-8 flex flex-col lg:flex-row gap-12">
        {/* Image Gallery */}
        <div className="lg:w-1/2">
          <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2">
          <p className="text-sm font-semibold uppercase tracking-widest text-theme-primary mb-2">{product.brand}</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-theme-text-base mb-4">{product.name}</h1>
          <p className="text-3xl font-light text-theme-text-base mb-6">{formatCurrency(product.price)}</p>
          <p className="text-theme-text-muted mb-8">{product.description}</p>
          
          {/* Size Selector */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-theme-text-base mb-3">Select Size (US)</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`
                    w-14 h-14 flex items-center justify-center text-lg font-bold rounded-md border-2 transition-colors
                    ${selectedSize === size
                      ? 'bg-theme-primary border-theme-primary text-white'
                      : 'bg-theme-bg-tertiary border-theme-border hover:border-theme-primary text-theme-text-base'
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center border border-theme-border rounded-md">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-3 text-lg text-theme-text-muted hover:bg-theme-bg-tertiary rounded-l-md"
              >
                -
              </button>
              <span className="px-4 py-3 text-lg font-semibold text-theme-text-base">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-4 py-3 text-lg text-theme-text-muted hover:bg-theme-bg-tertiary rounded-r-md"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className="flex-1 px-6 py-4 text-lg font-bold text-white bg-theme-primary hover:bg-theme-primary-hover rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
            >
              Add to Cart
            </button>
            <button
              onClick={toggleWishlist}
              aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
              className="p-4 border border-theme-border rounded-md text-theme-text-muted hover:bg-theme-bg-tertiary"
            >
                 {isLiked ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.662l1.318-1.344a4.5 4.5 0 116.364 6.364L12 20.348l-7.682-7.682a4.5 4.5 0 010-6.348z" />
                    </svg>
                )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
