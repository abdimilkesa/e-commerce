import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiSearch,
  FiRefreshCw,
  FiShoppingBag,
  FiDollarSign,
  FiClock,
  FiPackage,
  FiCalendar,
  FiCheckCircle,
} from "react-icons/fi";

import AdminLayout from "../components/AdminLayout";

const API_URL = "http://localhost:5000/api";

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  processing: "bg-blue-50 text-blue-700 ring-blue-200",
  shipped: "bg-violet-50 text-violet-700 ring-violet-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");
  const user = getStoredUser();

  const fetchOrders = useCallback(
    async (searchTerm = "") => {
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
    },
    [token]
  );

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      toast.error("Administrator access required");
      window.location.replace("/login");
      return;
    }

    fetchOrders();
  }, [token, user?.role, fetchOrders]);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchOrders(search);
  };

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

      setOrders((current) =>
        current.map((order) => (order._id === orderId ? data.order : order))
      );

      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(error.message || "Unable to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "pending"
  ).length;

  const processingOrders = orders.filter(
    (order) => order.orderStatus === "processing"
  ).length;

  const paidRevenue = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  const formatMoney = (amount) =>
    `${Number(amount || 0).toLocaleString()} Birr`;

  if (!token || user?.role !== "admin") {
    return null;
  }

  return (
    <AdminLayout
      title="Order Management"
      subtitle="Manage and track customer orders"
    >
      {/* PAGE HEADING */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
            <Link to="/admin" className="hover:text-blue-600">
              Dashboard
            </Link>

            <span>/</span>

            <span className="font-medium text-blue-600">Orders</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
            Orders
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage customer purchases and monitor order progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchOrders(search)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-300 hover:text-blue-600 disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh data
        </button>
      </div>

      {/* STATISTICS */}
      <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={totalOrders.toLocaleString()}
          note="Orders returned by the server"
          icon={<FiShoppingBag />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Pending Orders"
          value={pendingOrders.toLocaleString()}
          note="Waiting for processing"
          icon={<FiClock />}
          iconClass="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Processing Orders"
          value={processingOrders.toLocaleString()}
          note="Currently being prepared"
          icon={<FiPackage />}
          iconClass="bg-violet-50 text-violet-600"
        />

        <StatCard
          title="Paid Revenue"
          value={formatMoney(paidRevenue)}
          note="From paid orders in this list"
          icon={<FiDollarSign />}
          iconClass="bg-emerald-50 text-emerald-600"
        />
      </section>

      {/* ORDERS TABLE */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">All Orders</h2>

            <p className="mt-1 text-xs text-slate-400">
              Review customer purchases and update delivery status.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex w-full gap-2 sm:max-w-[360px]"
          >
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search orders..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-100 border-t-blue-600" />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-2xl text-slate-300">
              <FiShoppingBag />
            </div>

            <h3 className="font-semibold text-slate-800">No orders found</h3>

            <p className="mt-1 text-sm text-slate-400">
              Customer orders will appear here when they are placed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead className="bg-slate-50/80">
                <tr className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Order Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-blue-600">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {order.items?.length || 0} products
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-700">
                        {order.customer?.name || "N/A"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {order.customer?.email || ""}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <FiCalendar className="text-slate-400" />
                        {formatDate(order.createdAt)}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {formatMoney(order.totalAmount)}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : order.paymentStatus === "failed"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {order.paymentStatus || "pending"}
                      </span>

                      <p className="mt-1.5 text-xs capitalize text-slate-400">
                        {order.paymentMethod || "N/A"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={order.orderStatus || "pending"}
                        disabled={updatingId === order._id}
                        onChange={(event) =>
                          handleStatusChange(order._id, event.target.value)
                        }
                        className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize outline-none ring-1 ring-inset disabled:opacity-50 ${
                          statusStyles[order.orderStatus] ||
                          "bg-slate-50 text-slate-600 ring-slate-200"
                        }`}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      {updatingId === order._id && (
                        <p className="mt-1 text-[10px] text-blue-600">
                          Updating...
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col justify-between gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:px-6">
          <span>
            Showing {orders.length} orders. Maximum 100 orders per request.
          </span>

          <span className="inline-flex items-center gap-1">
            <FiCheckCircle className="text-emerald-500" />
            Order data loaded from your store
          </span>
        </div>
      </section>

      <footer className="py-6 text-center text-xs text-slate-400">
        Gebeya Admin · Order Management
      </footer>
    </AdminLayout>
  );
};

const StatCard = ({ title, value, note, icon, iconClass }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </h3>
      </div>

      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${iconClass}`}
      >
        {icon}
      </span>
    </div>

    <p className="mt-3 text-xs text-slate-400">{note}</p>
  </div>
);

export default Admin;
