import React, { useEffect, useState, useRef } from "react";
import { getMockProducts } from "../services/dataService";
import { Product } from "../types";
import { ProductCard } from "../components/UsersTable"; // Re-using UsersTable file for Product components

interface HomePageProps {
  onProductSelect: (product: Product) => void;
}

// Simple carousel component used inside Hero
const HeroCarousel: React.FC<{
  items: Product[];
  onSelect: (p: Product) => void;
  autoPlayMs?: number;
}> = ({ items, onSelect, autoPlayMs = 4000 }) => {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (items.length <= 1) return;
    intervalRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, autoPlayMs);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [items, autoPlayMs]);

  const goPrev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setIndex((i) => (i + 1) % items.length);

  if (items.length === 0) return null;

  return (
    <div className="relative w-full">
      <div className="rounded-xl shadow-2xl overflow-hidden">
        {/* <button
          aria-label="Previous"
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-theme-bg-primary/70 rounded-full backdrop-blur hover:bg-theme-bg-primary"
        >
          ◀
        </button> */}

        {/* <button
          aria-label="Next"
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-theme-bg-primary/70 rounded-full backdrop-blur hover:bg-theme-bg-primary"
        >
          ▶
        </button> */}

        <div className="w-full h-72 sm:h-96 relative">
          {items.map((p, idx) => (
            <img
              key={p.id}
              src={p.image}
              alt={p.name}
              onClick={() => onSelect(p)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 cursor-pointer ${
                idx === index ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`w-3 h-3 rounded-full ${
              idx === index ? "bg-theme-primary" : "bg-theme-bg-tertiary"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const HomePage: React.FC<HomePageProps> = ({ onProductSelect }) => {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getMockProducts();
      // pick 4 random unique products for hero carousel
      const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
      setFeatured(shuffled.slice(0, Math.min(4, shuffled.length)));
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="bg-theme-bg-primary shadow-lg rounded-xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-theme-text-base mb-4 leading-tight">
            Step Into Style
          </h1>
          <p className="text-lg text-theme-text-muted mb-6">
            Discover the latest trends and timeless classics. Tap a product to
            view details.
          </p>
          <button className="px-8 py-3 text-lg font-bold text-white bg-theme-primary hover:bg-theme-primary-hover rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary shadow-lg transform hover:scale-105 transition-transform">
            Shop Latest Shoes
          </button>
        </div>

        <div className="flex-1 w-full">
          <HeroCarousel items={featured} onSelect={onProductSelect} />
        </div>
      </div>

      {/* Featured Products Section */}
      <div>
        <h2 className="text-3xl font-bold text-theme-text-base mb-6">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductSelect={onProductSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
