import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiSearch,
  FiRefreshCw,
  FiShoppingBag,
  FiDollarSign,
  FiClock,
  FiPackage,
  FiUsers,
  FiPlus,
  FiArrowUpRight,
  FiHome,
  FiExternalLink,
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
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const formatMoney = (amount) => {
    return `${Number(amount || 0).toLocaleString()} Birr`;
  };

  if (!token || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-xl font-bold text-white">
              A
            </span>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-gray-900">
                Admin Panel
              </h2>
              <p className="text-xs text-gray-500">Store management</p>
            </div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-600 sm:px-4"
          >
            <FiHome />
            <span>View Store</span>
            <FiExternalLink />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 lg:py-10">
        {/* Welcome section */}
        <section className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[3px] text-orange-500">
              Administration
            </p>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Welcome back, {user?.name || "Admin"}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your store, products, customers, and orders from one place.
            </p>
          </div>

          <button
            onClick={() => fetchOrders(search)}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh Dashboard
          </button>
        </section>

        {/* Navigation cards */}
        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Store Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Choose what you want to manage.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <NavigationCard
              title="Products"
              description="Add new products, edit details, and manage your store inventory."
              icon={<FiPackage />}
              link="/admin/products"
              action="Manage Products"
            />

            <NavigationCard
              title="Customers"
              description="View registered customers and check their purchase history."
              icon={<FiUsers />}
              link="/admin/customers"
              action="Manage Customers"
            />

            <NavigationCard
              title="Orders"
              description="Review customer orders and update their delivery status."
              icon={<FiShoppingBag />}
              link="#orders"
              action="Manage Orders"
            />

            <NavigationCard
              title="View Store"
              description="Visit your customer homepage and check how products appear."
              icon={<FiHome />}
              link="/"
              action="Open Homepage"
              external
            />
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">Store Overview</h2>
            <p className="mt-1 text-sm text-gray-500">
              A quick overview of your latest order activity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        </section>

        {/* Order management */}
        <section
          id="orders"
          className="scroll-mt-24 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-orange-500">
                Order Management
              </p>

              <h2 className="text-xl font-bold text-gray-900">
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
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none transition focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="rounded-lg bg-black px-5 text-sm font-semibold text-white transition hover:bg-orange-500"
              >
                Search
              </button>
            </form>
          </div>

          {/* Orders table */}
          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
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
        </section>

        {/* Bottom store link */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl bg-black p-6 sm:flex-row">
          <div>
            <h3 className="text-lg font-bold text-white">
              Want to see your store?
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Check your customer homepage and newly added products.
            </p>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Visit Homepage
            <FiArrowUpRight />
          </Link>
        </div>
      </main>
    </div>
  );
};

// Navigation card
const NavigationCard = ({
  title,
  description,
  icon,
  link,
  action,
  external = false,
}) => {
  const isAnchor = link.startsWith("#");

  return (
    <Link
      to={link}
      className="group flex min-h-[220px] flex-col rounded-xl border border-gray-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
          {icon}
        </span>

        {external ? (
          <FiExternalLink className="text-gray-400 transition group-hover:text-orange-500" />
        ) : (
          <FiArrowUpRight className="text-gray-400 transition group-hover:text-orange-500" />
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      <p className="mt-2 flex-1 text-sm leading-6 text-gray-500">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-2 text-sm font-bold text-orange-600">
        {action}
        <FiArrowUpRight />
      </div>
    </Link>
  );
};

// Statistics card
const StatCard = ({ title, value, icon }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-orange-200 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>

        <span className="rounded-lg bg-orange-50 p-3 text-lg text-orange-500">
          {icon}
        </span>
      </div>

      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  );
};

export default Admin;
