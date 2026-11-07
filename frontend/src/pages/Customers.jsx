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

  useEffect(() => {
    const timer = setTimeout(fetchCustomers, 400);
    return () => clearTimeout(timer);
  }, [search]);

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

  // FETCH A CUSTOMER'S ORDER HISTORY
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
    <div className="min-h-screen bg-[#f8f8f8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[3px] text-orange-500">
              Admin Dashboard
            </p>

            <h1 className="text-2xl font-bold text-black sm:text-3xl">
              Customers
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage customers and monitor their shopping activity.
            </p>
          </div>

          <button
            onClick={fetchCustomers}
            className="flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>

        {/* CUSTOMER SUMMARY */}
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl text-orange-500">
              <FiUsers />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <h2 className="text-2xl font-bold text-black">
                {customers.length}
              </h2>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers by name or email..."
              className="w-full rounded-lg border border-gray-200 py-3 pl-11 pr-4 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-orange-500"
            />
          </div>
        </div>

        {/* CUSTOMER TABLE */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="font-bold text-black">Customer List</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
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
                      className="transition hover:bg-orange-50/40"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-bold uppercase text-white">
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
                          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-500"
                        >
                          <FiEye />
                          View
                        </button>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => viewCustomerOrders(customer)}
                          className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white"
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
              <h2 className="text-xl font-bold text-black">Customer Details</h2>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="mb-6 flex flex-col items-center">
              <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-3xl font-bold uppercase text-orange-500">
                {selectedCustomer.name?.charAt(0) || "C"}
              </div>

              <h3 className="text-lg font-bold text-black">
                {selectedCustomer.name}
              </h3>

              <span className="mt-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                Customer
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                <FiMail className="mt-1 text-orange-500" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Email Address</p>
                  <p className="break-all text-sm font-semibold text-gray-800">
                    {selectedCustomer.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
                <FiCalendar className="mt-1 text-orange-500" />
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
              className="mt-6 w-full rounded-lg bg-black py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CUSTOMER ORDER HISTORY MODAL */}
      {selectedOrdersCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-[#f8f8f8] shadow-2xl">
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-5 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
                  Customer Management
                </p>

                <h2 className="mt-1 text-lg font-bold text-black sm:text-xl">
                  Order History
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedOrdersCustomer.name}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrdersCustomer(null)}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-black"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="p-5 sm:p-7">
              {ordersLoading ? (
                <div className="flex justify-center py-20">
                  <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
                </div>
              ) : (
                <>
                  {/* ORDER SUMMARY */}
                  <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-orange-100 p-3 text-orange-500">
                          <FiPackage size={20} />
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Total Orders</p>
                          <h3 className="text-2xl font-bold text-black">
                            {orderSummary.count}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-green-100 p-3 text-green-600">
                          <FiDollarSign size={20} />
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Total Paid</p>
                          <h3 className="text-xl font-bold text-black">
                            {formatCurrency(orderSummary.totalSpent)}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ORDER LIST */}
                  <div className="mb-4 flex items-center gap-2">
                    <FiShoppingBag className="text-orange-500" />
                    <h3 className="font-bold text-black">Customer Orders</h3>
                  </div>

                  {customerOrders.length === 0 ? (
                    <div className="rounded-xl border border-gray-100 bg-white py-16 text-center">
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
                          className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
                        >
                          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                              <p className="text-xs text-gray-400">Order ID</p>

                              <p className="break-all text-sm font-bold text-black">
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
                              <p className="text-sm font-bold text-orange-600">
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

                                  <p className="text-sm font-semibold text-black">
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
                className="w-full rounded-lg bg-black py-3 text-sm font-semibold text-white transition hover:bg-orange-500 sm:w-auto sm:px-10"
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
          <div className="rounded-xl bg-white px-6 py-4 text-sm font-semibold text-black shadow-xl">
            Loading customer details...
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
