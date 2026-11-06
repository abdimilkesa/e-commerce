import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FiSearch,
  FiRefreshCw,
  FiShoppingBag,
  FiDollarSign,
  FiClock,
  FiPackage,
} from "react-icons/fi";

const API_URL = "http://localhost:5000/api";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Fetch all orders
  const fetchOrders = async (searchTerm = "") => {
    try {
      setLoading(true);

      const query = searchTerm
        ? `?search=${encodeURIComponent(searchTerm)}`
        : "";

      const response = await fetch(`${API_URL}/orders/admin/all${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch orders");
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Admin orders error:", error);
      toast.error(error.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      toast.error("Administrator access required");
      window.location.replace("/login");
      return;
    }

    fetchOrders();
  }, []);

  // Search orders
  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(search);
  };

  // Update order status
  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      setUpdatingId(orderId);

      const response = await fetch(
        `${API_URL}/orders/admin/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update order");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? data.order : order))
      );

      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(error.message || "Unable to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Dashboard statistics
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "delivered"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((total, order) => total + (order.totalAmount || 0), 0);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatMoney = (amount) => {
    return `${Number(amount || 0).toLocaleString()} Birr`;
  };

  if (!token || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[3px] text-gray-500">
              Administration
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Order Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage and monitor your customer orders.
            </p>
          </div>

          <button
            onClick={() => fetchOrders(search)}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh Orders
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={<FiShoppingBag />}
          />

          <StatCard
            title="Pending Orders"
            value={pendingOrders}
            icon={<FiClock />}
          />

          <StatCard
            title="Delivered Orders"
            value={deliveredOrders}
            icon={<FiPackage />}
          />

          <StatCard
            title="Paid Revenue"
            value={formatMoney(totalRevenue)}
            icon={<FiDollarSign />}
          />
        </div>

        {/* Orders Section */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Customer Orders
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Manage customer purchases and delivery progress.
              </p>
            </div>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="flex w-full gap-2 sm:max-w-md"
            >
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-black px-5 text-sm font-medium text-white hover:bg-gray-800"
              >
                Search
              </button>
            </form>
          </div>

          {/* Orders Table */}
          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
              <FiShoppingBag className="mb-4 text-4xl text-gray-300" />

              <h3 className="font-semibold text-gray-800">No orders found</h3>

              <p className="mt-2 text-sm text-gray-500">
                Customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Customer</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Payment</th>
                    <th className="px-5 py-4">Order Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="transition hover:bg-gray-50">
                      <td className="px-5 py-5">
                        <p className="font-semibold text-gray-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {order.items?.length || 0} products
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="font-medium text-gray-900">
                          {order.customer?.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {order.customer?.email}
                        </p>
                      </td>

                      <td className="px-5 py-5 text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-5 py-5 text-sm font-semibold text-gray-900">
                        {formatMoney(order.totalAmount)}
                      </td>

                      <td className="px-5 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : order.paymentStatus === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>

                        <p className="mt-2 text-xs capitalize text-gray-500">
                          {order.paymentMethod}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <select
                          value={order.orderStatus}
                          disabled={updatingId === order._id}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className={`rounded-lg border-0 px-3 py-2 text-xs font-semibold capitalize outline-none ring-1 ring-inset ring-gray-200 ${
                            statusStyles[order.orderStatus] ||
                            "bg-gray-100 text-gray-700"
                          } disabled:opacity-50`}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-500">
            Showing {orders.length} orders (maximum 100 per request).
          </div>
        </div>
      </div>
    </div>
  );
};

// Statistics card
const StatCard = ({ title, value, icon }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>

        <span className="rounded-lg bg-gray-100 p-3 text-lg text-gray-700">
          {icon}
        </span>
      </div>

      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  );
};

export default Admin;
