import React, { useState, useEffect, useRef } from "react";
import { Product } from "../types";
import { getProducts } from "../services/dataService";
import { formatCurrency } from "../services/exportService";

interface SearchBarProps {
  onProductSelect: (product: Product) => void;
  onSearchResults?: (results: Product[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onProductSelect,
  onSearchResults,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts();
        setAllProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Update suggestions when search query changes
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
    );

    setSuggestions(filtered.slice(0, 5)); // Show max 5 suggestions
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  }, [searchQuery, allProducts]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length === 0) return;

    const query = searchQuery.toLowerCase();
    const results = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
    );

    console.log("🔍 Search results:", results.length);

    // Trigger search results callback
    if (onSearchResults) {
      onSearchResults(results);
    }

    // Navigate to products page with results
    window.dispatchEvent(
      new CustomEvent("search", { detail: { query: searchQuery, results } })
    );

    setShowSuggestions(false);
  };

  const handleSuggestionClick = (product: Product) => {
    console.log("🎯 Product selected from search:", product.name);
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    // Navigate to product detail
    onProductSelect(product);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={i}
              className="bg-theme-primary/30 text-theme-text-base font-semibold"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search for shoes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          className="w-full pl-10 pr-4 py-2 rounded-full bg-theme-bg-tertiary text-theme-text-base border border-transparent focus:border-theme-primary focus:ring-1 focus:ring-theme-primary focus:outline-none transition"
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-text-muted hover:text-theme-primary transition"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-theme-bg-primary border border-theme-border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <p className="px-3 py-2 text-xs text-theme-text-muted font-semibold uppercase">
              {suggestions.length} result{suggestions.length > 1 ? "s" : ""}{" "}
              found
            </p>
            {suggestions.map((product, index) => (
              <button
                key={product._id}
                type="button"
                onClick={() => handleSuggestionClick(product)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                  index === selectedIndex
                    ? "bg-theme-primary/20 scale-[0.98]"
                    : "hover:bg-theme-bg-tertiary hover:scale-[0.99]"
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-md flex-shrink-0 shadow-sm"
                />
                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-theme-text-base truncate">
                    {highlightMatch(product.name, searchQuery)}
                  </p>
                  <p className="text-sm text-theme-text-muted">
                    {highlightMatch(product.brand, searchQuery)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-theme-primary text-sm">
                    {formatCurrency(product.price)}
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-theme-text-muted ml-auto mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {showSuggestions &&
        searchQuery.trim().length > 0 &&
        suggestions.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-theme-bg-primary border border-theme-border rounded-lg shadow-xl z-50 p-4">
            <div className="text-center text-theme-text-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-2 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-semibold">No products found</p>
              <p className="text-sm">Try searching with different keywords</p>
            </div>
          </div>
        )}
    </div>
  );
};

export default SearchBar;
