import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FiUsers,
  FiSearch,
  FiMail,
  FiCalendar,
  FiEye,
  FiX,
  FiRefreshCw,
  FiShoppingBag,
  FiPackage,
  FiDollarSign,
  FiClock,
} from "react-icons/fi";

import AdminLayout from "../components/AdminLayout";

const API_URL = "http://localhost:5000/api/customers";
const ORDER_API_URL = "http://localhost:5000/api/orders";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [selectedOrdersCustomer, setSelectedOrdersCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [orderSummary, setOrderSummary] = useState({
    count: 0,
    totalSpent: 0,
  });
  const [ordersLoading, setOrdersLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch customers.
  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}?search=${encodeURIComponent(search)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load customers");
      }

      setCustomers(data.customers || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounced customer search.
  useEffect(() => {
    if (!token) {
      toast.error("Please log in first.");
      window.location.replace("/login");
      return;
    }

    const timer = setTimeout(fetchCustomers, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // View customer details.
  const viewCustomer = async (customerId) => {
    try {
      setDetailsLoading(true);

      const response = await fetch(`${API_URL}/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load customer");
      }

      setSelectedCustomer(data.customer);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Fetch customer's order history.
  const viewCustomerOrders = async (customer) => {
    try {
      setOrdersLoading(true);
      setSelectedOrdersCustomer(customer);
      setCustomerOrders([]);
      setOrderSummary({ count: 0, totalSpent: 0 });

      const response = await fetch(
        `${ORDER_API_URL}/admin/customer/${customer._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load order history");
      }

      setCustomerOrders(data.orders || []);

      setOrderSummary({
        count: data.count || 0,
        totalSpent: data.totalSpent || 0,
      });
    } catch (error) {
      toast.error(error.message);
      setSelectedOrdersCustomer(null);
    } finally {
      setOrdersLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `ETB ${Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      paid: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
    };

    return styles[status?.toLowerCase()] || "bg-gray-100 text-gray-600";
  };

  return (
    <AdminLayout
      title="Customer Management"
      subtitle="Manage customers and monitor their shopping activity"
    >
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Customers</h2>

            <p className="mt-1 text-sm text-gray-500">
              View customer information and shopping activity.
            </p>
          </div>

          <button
            onClick={fetchCustomers}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-blue-500 hover:text-blue-600 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* CUSTOMER SUMMARY */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
                <FiUsers />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Customers
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {customers.length}
                </h2>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-xl text-green-600">
                <FiShoppingBag />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Registered Customers
                </p>

                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  {customers.length}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers by name or email..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500"
            />
          </div>
        </div>

        {/* CUSTOMER TABLE */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="font-bold text-gray-900">Customer List</h2>
              <p className="mt-1 text-xs text-gray-500">
                {customers.length} customers found
              </p>
            </div>

            <FiUsers className="text-xl text-gray-400" />
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <FiRefreshCw className="animate-spin text-3xl text-blue-600" />
            </div>
          ) : customers.length === 0 ? (
            <div className="py-16 text-center">
              <FiUsers className="mx-auto mb-3 text-4xl text-gray-300" />

              <p className="font-semibold text-gray-700">No customers found</p>

              <p className="mt-1 text-sm text-gray-400">Try another search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-center">Details</th>
                    <th className="px-6 py-4 text-center">Order History</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {customers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="transition hover:bg-blue-50/40"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold uppercase text-white">
                            {customer.name?.charAt(0) || "C"}
                          </div>

                          <span className="font-semibold text-gray-800">
                            {customer.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.email}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(customer.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => viewCustomer(customer._id)}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                        >
                          <FiEye />
                          View
                        </button>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => viewCustomerOrders(customer)}
                          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                        >
                          <FiShoppingBag />
                          View Orders
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* CUSTOMER DETAILS MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Customer Details
              </h2>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="mb-6 flex flex-col items-center">
              <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-3xl font-bold uppercase text-blue-600">
                {selectedCustomer.name?.charAt(0) || "C"}
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                {selectedCustomer.name}
              </h3>

              <span className="mt-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                Customer
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                <FiMail className="mt-1 text-blue-600" />

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Email Address</p>

                  <p className="break-all text-sm font-semibold text-gray-800">
                    {selectedCustomer.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                <FiCalendar className="mt-1 text-blue-600" />

                <div>
                  <p className="text-xs text-gray-400">Registration Date</p>

                  <p className="text-sm font-semibold text-gray-800">
                    {formatDate(selectedCustomer.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
              className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CUSTOMER ORDER HISTORY MODAL */}
      {selectedOrdersCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-gray-50 shadow-2xl">
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-5 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  Customer Management
                </p>

                <h2 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">
                  Order History
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedOrdersCustomer.name}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrdersCustomer(null)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="p-5 sm:p-7">
              {ordersLoading ? (
                <div className="flex justify-center py-20">
                  <FiRefreshCw className="animate-spin text-3xl text-blue-600" />
                </div>
              ) : (
                <>
                  {/* ORDER SUMMARY */}
                  <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                          <FiPackage size={20} />
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Total Orders</p>

                          <h3 className="text-2xl font-bold text-gray-900">
                            {orderSummary.count}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-green-50 p-3 text-green-600">
                          <FiDollarSign size={20} />
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Total Paid</p>

                          <h3 className="text-xl font-bold text-gray-900">
                            {formatCurrency(orderSummary.totalSpent)}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ORDER LIST */}
                  <div className="mb-4 flex items-center gap-2">
                    <FiShoppingBag className="text-blue-600" />
                    <h3 className="font-bold text-gray-900">Customer Orders</h3>
                  </div>

                  {customerOrders.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
                      <FiShoppingBag className="mx-auto mb-3 text-4xl text-gray-300" />

                      <h3 className="font-semibold text-gray-700">
                        No orders yet
                      </h3>

                      <p className="mt-1 text-sm text-gray-400">
                        This customer has not placed any orders.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customerOrders.map((order) => (
                        <div
                          key={order._id}
                          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                        >
                          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                              <p className="text-xs text-gray-400">Order ID</p>

                              <p className="break-all text-sm font-bold text-gray-900">
                                #{order._id}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                  order.orderStatus
                                )}`}
                              >
                                {order.orderStatus}
                              </span>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                  order.paymentStatus
                                )}`}
                              >
                                Payment: {order.paymentStatus}
                              </span>
                            </div>
                          </div>

                          <div className="mb-4 grid grid-cols-1 gap-3 border-y border-gray-100 py-4 sm:grid-cols-3">
                            <div>
                              <p className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                                <FiCalendar />
                                Order Date
                              </p>

                              <p className="text-sm font-semibold text-gray-700">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>

                            <div>
                              <p className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                                <FiClock />
                                Payment Method
                              </p>

                              <p className="text-sm font-semibold capitalize text-gray-700">
                                {order.paymentMethod}
                              </p>
                            </div>

                            <div>
                              <p className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                                <FiDollarSign />
                                Total Amount
                              </p>

                              <p className="text-sm font-bold text-blue-600">
                                {formatCurrency(order.totalAmount)}
                              </p>
                            </div>
                          </div>

                          <div>
                            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                              Products
                            </p>

                            <div className="space-y-2">
                              {order.items?.map((item, index) => (
                                <div
                                  key={`${order._id}-${index}`}
                                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-gray-50 px-4 py-3"
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                      {item.name}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                      Size: {item.size || "N/A"} · Quantity:{" "}
                                      {item.quantity}
                                    </p>
                                  </div>

                                  <p className="text-sm font-semibold text-gray-900">
                                    {formatCurrency(item.price * item.quantity)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="border-t border-gray-100 bg-white p-5">
              <button
                onClick={() => setSelectedOrdersCustomer(null)}
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto sm:px-10"
              >
                Close Order History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOADING CUSTOMER DETAILS */}
      {detailsLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <div className="rounded-xl bg-white px-6 py-4 text-sm font-semibold text-gray-900 shadow-xl">
            Loading customer details...
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Customers;
