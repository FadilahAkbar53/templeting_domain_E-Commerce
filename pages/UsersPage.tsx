import React, { useEffect, useState, useMemo } from "react";
import {
  ProductGrid,
  ProductFilters,
  ProductTopFilters,
} from "../components/UsersTable";
import { getMockProducts } from "../services/dataService";
import { Product } from "../types";

interface ProductsPageProps {
  onProductSelect: (product: Product) => void;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ onProductSelect }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    brand: "All",
    size: "All",
    price: 1000,
  });
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const product_data = await getMockProducts();
        setProducts(product_data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    // Filtering
    if (filters.brand !== "All") {
      result = result.filter((p) => p.brand === filters.brand);
    }
    if (filters.size !== "All") {
      result = result.filter((p) => p.sizes.includes(Number(filters.size)));
    }
    result = result.filter((p) => p.price <= filters.price);

    // Sorting
    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, filters, sort]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-theme-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ProductTopFilters
        products={products}
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
      />

      <ProductGrid
        products={filteredAndSortedProducts}
        onProductSelect={onProductSelect}
      />
    </div>
  );
};

export default ProductsPage;
