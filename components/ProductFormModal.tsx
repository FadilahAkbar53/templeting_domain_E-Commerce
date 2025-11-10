import React, { useState, useEffect } from "react";
import { Product } from "../types";

interface Brand {
  _id: string;
  name: string;
  isActive: boolean;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "_id"> | Product) => void;
  product: Product | null;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    sizes: "",
    image: "",
    description: "",
  });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(false);

  // Fetch brands when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBrands();
    }
  }, [isOpen]);

  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const response = await fetch("/api/brands");
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoadingBrands(false);
    }
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        brand: product.brand,
        price: String(product.price),
        sizes: product.sizes.join(", "),
        image: product.image,
        description: product.description,
      });
    } else {
      setFormData({
        name: "",
        brand: "",
        price: "",
        sizes: "",
        image: "",
        description: "",
      });
    }
  }, [product, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.brand || !formData.price) {
      alert("Please fill in all required fields.");
      return;
    }

    const productData = {
      name: formData.name,
      brand: formData.brand,
      price: parseFloat(formData.price) || 0,
      sizes: formData.sizes
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((s) => !isNaN(s)),
      image: formData.image,
      description: formData.description,
    };

    if (product) {
      onSave({ ...productData, _id: product._id });
    } else {
      onSave(productData);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-theme-bg-primary rounded-xl shadow-2xl p-8 w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-theme-text-base mb-6">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-theme-text-muted mb-1"
            >
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-theme-bg-tertiary border border-theme-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-theme-text-muted mb-1"
              >
                Brand
              </label>
              <select
                name="brand"
                id="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                disabled={loadingBrands}
                className="w-full bg-theme-bg-tertiary border border-theme-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary disabled:opacity-50"
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {brands.length === 0 && !loadingBrands && (
                <p className="text-xs text-theme-text-muted mt-1">
                  No brands available. Please add brands first in Brand
                  Management.
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-theme-text-muted mb-1"
              >
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full bg-theme-bg-tertiary border border-theme-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="sizes"
              className="block text-sm font-medium text-theme-text-muted mb-1"
            >
              Sizes (comma-separated)
            </label>
            <input
              type="text"
              name="sizes"
              id="sizes"
              value={formData.sizes}
              onChange={handleChange}
              className="w-full bg-theme-bg-tertiary border border-theme-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary"
            />
          </div>
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-theme-text-muted mb-1"
            >
              Image URL
            </label>
            <input
              type="text"
              name="image"
              id="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full bg-theme-bg-tertiary border border-theme-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-theme-text-muted mb-1"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-theme-bg-tertiary border border-theme-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary"
            ></textarea>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-theme-text-base bg-theme-bg-tertiary hover:bg-theme-border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-theme-primary hover:bg-theme-primary-hover rounded-lg"
            >
              {product ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
