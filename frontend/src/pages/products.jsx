import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiRefreshCw,
  FiX,
  FiPackage,
  FiSearch,
} from "react-icons/fi";

import AdminLayout from "../components/AdminLayout";

const API_URL = "http://localhost:5000/api";
const SERVER_URL = "http://localhost:5000";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/120x120/f3f4f6/9ca3af?text=No+Image";

const initialForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "Women",
  subCategory: "",
  sizes: "",
  stock: "0",
  currency: "ETB",
  isActive: true,
  bestseller: false,
};

const getImageArray = (image) => {
  if (Array.isArray(image)) {
    return image.filter(Boolean);
  }

  if (typeof image === "string" && image.trim()) {
    return image
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const getImageUrl = (image) => {
  if (!image) return PLACEHOLDER_IMAGE;

  const imagePath = String(image).trim();

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }

  if (imagePath.startsWith("/uploads/") || imagePath.startsWith("uploads/")) {
    return `${SERVER_URL}/${imagePath.replace(/^\/+/, "")}`;
  }

  if (imagePath.startsWith("/")) {
    return imagePath;
  }

  if (!imagePath.includes("/")) {
    return `${SERVER_URL}/uploads/${imagePath}`;
  }

  return `${SERVER_URL}/${imagePath}`;
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState(initialForm);

  const token = localStorage.getItem("token");

  // Fetch all products.
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/products/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products.");
      }

      setProducts(data.products || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please log in first.");
      window.location.replace("/login");
      return;
    }

    fetchProducts();
  }, []);

  // Handle form changes.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Open add form.
  const openAddForm = () => {
    setEditingId(null);
    setFormData({ ...initialForm });
    setShowForm(true);
  };

  // Open edit form.
  const openEditForm = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      image: getImageArray(product.image).join(", "),
      category: product.category || "Women",
      subCategory: product.subCategory || "",
      sizes: (product.sizes || []).join(", "),
      stock: String(product.stock ?? 0),
      currency: product.currency || "ETB",
      isActive: product.isActive ?? true,
      bestseller: product.bestseller ?? false,
    });

    setShowForm(true);
  };

  // Create or update product.
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const imageArray = getImageArray(formData.image);

      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: imageArray,
        sizes: formData.sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean),
      };

      const url = editingId
        ? `${API_URL}/products/${editingId}`
        : `${API_URL}/products`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save product.");
      }

      toast.success(data.message || "Product saved successfully.");

      setShowForm(false);
      setFormData({ ...initialForm });
      setEditingId(null);

      await fetchProducts();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Deactivate product.
  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this product?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to deactivate product.");
      }

      toast.success(data.message || "Product deactivated successfully.");

      await fetchProducts();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Search products.
  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category} ${product.subCategory || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Preview first image.
  const previewImage = getImageArray(formData.image)[0];

  return (
    <AdminLayout
      title="Product Management"
      subtitle="Manage your store products, prices, and inventory"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Products</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your products and inventory.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            <FiPlus size={18} />
            Add Product
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              {products.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Active Products</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {products.filter((p) => p.isActive).length}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Inactive Products
            </p>
            <h2 className="mt-2 text-3xl font-bold text-red-500">
              {products.filter((p) => !p.isActive).length}
            </h2>
          </div>
        </div>

        {/* Search and Refresh */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name or category..."
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500"
            />
          </div>

          <button
            onClick={fetchProducts}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Products Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex justify-center py-20">
              <FiRefreshCw className="animate-spin text-3xl text-blue-600" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <FiPackage className="mx-auto text-4xl text-gray-300" />

              <h3 className="mt-4 font-bold text-gray-800">
                No products found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add a product or try another search.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => {
                    const productImages = getImageArray(product.image);
                    const firstImage = productImages[0];

                    return (
                      <tr
                        key={product._id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={getImageUrl(firstImage)}
                              alt={product.name}
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = PLACEHOLDER_IMAGE;
                              }}
                              className="h-14 w-14 shrink-0 rounded-xl border border-gray-100 bg-gray-50 object-cover"
                            />

                            <div className="min-w-0 max-w-[190px]">
                              <p
                                className="truncate text-sm font-semibold text-gray-900"
                                title={product.name}
                              >
                                {product.name}
                              </p>

                              {product.bestseller && (
                                <span className="mt-1 inline-block text-xs font-semibold text-orange-500">
                                  Bestseller
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.category}
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {product.currency || "ETB"}{" "}
                          {Number(product.price).toFixed(2)}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.stock}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              product.isActive
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditForm(product)}
                              title="Edit product"
                              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-blue-500 hover:text-blue-600"
                            >
                              <FiEdit size={16} />
                            </button>

                            {product.isActive && (
                              <button
                                onClick={() => handleDelete(product._id)}
                                title="Deactivate product"
                                className="rounded-lg border border-gray-200 p-2 text-red-500 transition hover:border-red-500 hover:bg-red-50"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Product Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-950">
                    {editingId ? "Edit Product" : "Add New Product"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Enter your product information below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Product Name *
                    </label>

                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Product name"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Price *
                    </label>

                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe your product..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {/* Product Images */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Product Image URLs
                  </label>

                  <textarea
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Enter image URLs separated by commas"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Add one or more image URLs. Separate multiple URLs with
                    commas.
                  </p>

                  {previewImage && (
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={getImageUrl(previewImage)}
                        alt={formData.name || "Product preview"}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = PLACEHOLDER_IMAGE;
                        }}
                        className="h-14 w-14 shrink-0 rounded-xl border border-gray-100 bg-gray-50 object-cover"
                      />

                      <p className="text-xs text-gray-500">
                        First product image preview
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Category *
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="Women">Women</option>
                      <option value="Men">Men</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Subcategory
                    </label>

                    <input
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleChange}
                      placeholder="e.g. T-shirts"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Sizes
                    </label>

                    <input
                      name="sizes"
                      value={formData.sizes}
                      onChange={handleChange}
                      placeholder="S, M, L, XL"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />

                    <p className="mt-1 text-xs text-gray-400">
                      Separate sizes with commas.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Stock Quantity
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Currency
                  </label>

                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="ETB">ETB</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="accent-blue-600"
                    />
                    Active product
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      name="bestseller"
                      checked={formData.bestseller}
                      onChange={handleChange}
                      className="accent-blue-600"
                    />
                    Bestseller
                  </label>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Update Product"
                      : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Products;
