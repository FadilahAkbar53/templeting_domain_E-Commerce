import React, { useState, useEffect, useCallback } from "react";
import { Product } from "../../types";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../services/dataService";
import { formatCurrency } from "../../services/exportService";
import ProductFormModal from "../../components/ProductFormModal";

const ProductsManagementPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        await fetchProducts();
      } catch (err) {
        setError("Failed to delete product.");
        console.error(err);
      }
    }
  };

  const handleSave = async (productData: Product | Omit<Product, "_id">) => {
    try {
      if ("_id" in productData) {
        await updateProduct(productData);
      } else {
        await addProduct(productData as Omit<Product, "_id">);
      }
      setIsModalOpen(false);
      await fetchProducts();
    } catch (err) {
      setError("Failed to save product.");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-theme-bg-primary shadow-lg rounded-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-theme-text-base">
            Product Management
          </h1>
          <button
            onClick={handleAddNew}
            className="px-5 py-2.5 font-medium text-white bg-theme-primary hover:bg-theme-primary-hover rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary"
          >
            Add New Product
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-theme-primary"></div>
          </div>
        )}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-theme-text-muted">
              <thead className="text-xs text-theme-text-base uppercase bg-theme-bg-tertiary">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Brand
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="bg-theme-bg-primary border-b border-theme-border hover:bg-theme-bg-secondary"
                  >
                    <td className="p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold text-theme-text-base whitespace-nowrap">
                      {product.name}
                    </td>
                    <td className="px-6 py-4">{product.brand}</td>
                    <td className="px-6 py-4 font-semibold">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        product={editingProduct}
      />
    </div>
  );
};

export default ProductsManagementPage;
