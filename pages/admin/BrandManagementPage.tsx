import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface Brand {
  _id: string;
  name: string;
  logo: string;
  description: string;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
}

const BrandManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    description: "",
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const token = user?.token;

      const response = await fetch("/api/brands/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch brands");
      }

      const data = await response.json();
      setBrands(data);
    } catch (err) {
      setError("Failed to load brands");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        name: brand.name,
        logo: brand.logo,
        description: brand.description,
      });
    } else {
      setEditingBrand(null);
      setFormData({
        name: "",
        logo: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
    setFormData({ name: "", logo: "", description: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Brand name is required");
      return;
    }

    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = user?.token;
      const url = editingBrand
        ? `/api/brands/${editingBrand._id}`
        : "/api/brands";

      const response = await fetch(url, {
        method: editingBrand ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save brand");
      }

      await fetchBrands();
      handleCloseModal();
      alert(
        editingBrand
          ? "Brand updated successfully!"
          : "Brand created successfully!"
      );
    } catch (err: any) {
      alert(err.message || "Failed to save brand");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (
    brandId: string,
    brandName: string,
    productCount: number
  ) => {
    if (productCount > 0) {
      alert(
        `Cannot delete "${brandName}". ${productCount} product(s) are using this brand.`
      );
      return;
    }

    if (
      !window.confirm(`Are you sure you want to delete brand "${brandName}"?`)
    ) {
      return;
    }

    try {
      const token = user?.token;

      const response = await fetch(
        `/api/brands/${brandId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete brand");
      }

      await fetchBrands();
      alert("Brand deleted successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to delete brand");
      console.error(err);
    }
  };

  const handleToggleActive = async (brand: Brand) => {
    try {
      const token = user?.token;

      const response = await fetch(
        `/api/brands/${brand._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...brand, isActive: !brand.isActive }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update brand status");
      }

      await fetchBrands();
    } catch (err) {
      alert("Failed to update brand status");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-theme-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-theme-bg-primary shadow-lg rounded-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-theme-text-base">
              Brand Management
            </h1>
            <p className="text-theme-text-muted mt-1">
              Manage product brands for consistency
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 sm:mt-0 px-5 py-2.5 font-medium text-white bg-theme-primary hover:bg-theme-primary-hover rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary"
          >
            Add New Brand
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <div
              key={brand._id}
              className={`bg-theme-bg-secondary rounded-lg p-4 border-2 transition-all ${
                brand.isActive
                  ? "border-theme-primary"
                  : "border-gray-300 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-theme-text-base">
                    {brand.name}
                  </h3>
                  {brand.description && (
                    <p className="text-sm text-theme-text-muted mt-1">
                      {brand.description}
                    </p>
                  )}
                </div>
                {brand.logo && (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-12 h-12 object-contain ml-2"
                  />
                )}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-theme-border">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      brand.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}
                  >
                    {brand.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs text-theme-text-muted">
                    {brand.productCount || 0} products
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleOpenModal(brand)}
                  className="flex-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(brand)}
                  className="flex-1 px-3 py-1.5 text-sm font-medium text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded transition-colors"
                >
                  {brand.isActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() =>
                    handleDelete(brand._id, brand.name, brand.productCount || 0)
                  }
                  className="flex-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  disabled={!!brand.productCount}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {brands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-theme-text-muted text-lg">
              No brands yet. Create your first brand!
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-theme-bg-primary rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-theme-text-base mb-4">
              {editingBrand ? "Edit Brand" : "Add New Brand"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-theme-text-base mb-1">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-theme-bg-secondary border border-theme-border text-theme-text-base focus:outline-none focus:ring-2 focus:ring-theme-primary"
                  placeholder="e.g., Nike, Adidas"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text-base mb-1">
                  Logo URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-theme-bg-secondary border border-theme-border text-theme-text-base focus:outline-none focus:ring-2 focus:ring-theme-primary"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-text-base mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-theme-bg-secondary border border-theme-border text-theme-text-base focus:outline-none focus:ring-2 focus:ring-theme-primary"
                  placeholder="Brief description about the brand"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 font-medium text-theme-text-base bg-theme-bg-secondary hover:bg-theme-bg-tertiary rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 font-medium text-white bg-theme-primary hover:bg-theme-primary-hover rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingBrand
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandManagementPage;
