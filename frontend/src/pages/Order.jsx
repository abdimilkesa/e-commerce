import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiPackage,
  FiCalendar,
  FiCreditCard,
  FiShoppingBag,
  FiRefreshCw,
} from "react-icons/fi";

const OrderTracker = ({ status }) => {
  const steps = ["pending", "processing", "shipped", "delivered"];

  const currentStatus = status?.toLowerCase();

  if (currentStatus === "cancelled") {
    return (
      <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">
        This order has been cancelled.
      </div>
    );
  }

  const currentIndex = steps.indexOf(currentStatus);

  return (
    <div className="mt-6">
      <h3 className="mb-5 text-sm font-semibold text-gray-900">
        Order Tracking
      </h3>

      <div className="flex items-center">
        {steps.map((step, index) => {
          const completed = currentIndex >= index;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    completed
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>

                <span
                  className={`mt-2 text-center text-[10px] capitalize sm:text-xs ${
                    completed ? "font-semibold text-black" : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>

              {index !== steps.length - 1 && (
                <div
                  className={`mb-5 h-1 flex-1 rounded-full ${
                    currentIndex > index ? "bg-black" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const Order = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please log in to view your orders.");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/orders/my-orders",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load orders.");
        }

        setOrders(data.orders || []);
      } catch (error) {
        toast.error(error.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const formatPrice = (amount) =>
    `${Number(amount || 0).toLocaleString()} Birr`;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getPaymentStyle = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getOrderStyle = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <FiRefreshCw className="animate-spin text-orange-600" size={35} />
        <p className="text-gray-500 mt-4">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-28">
      <div className="max-w-5xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-10">
          <p className="text-sm text-orange-600 font-semibold uppercase tracking-wider mb-2">
            Your account
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            My Orders
          </h1>

          <p className="text-gray-500 mt-3">
            Track and manage your recent purchases.
          </p>
        </div>

        {/* ORDER COUNT */}
        <div className="bg-white rounded-xl p-5 shadow-sm mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <FiPackage size={23} className="text-orange-600" />
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {orders.length}
            </h2>
          </div>
        </div>

        {/* EMPTY ORDERS */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <FiShoppingBag size={55} className="mx-auto text-gray-300 mb-5" />

            <h2 className="text-xl font-bold text-gray-900">No Orders Yet</h2>

            <p className="text-gray-500 mt-3">
              You haven't placed any orders yet. Start shopping to see your
              orders here.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-7 bg-black hover:bg-orange-600 text-white px-7 py-3 rounded-lg transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* ORDER HEADER */}
                <div className="p-5 sm:p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Order ID
                      </p>

                      <p className="font-semibold text-gray-900 text-sm mt-1 break-all">
                        {order._id}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPaymentStyle(
                          order.paymentStatus
                        )}`}
                      >
                        Payment: {order.paymentStatus}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getOrderStyle(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-5">
                    <FiCalendar />
                    <span>Ordered on {formatDate(order.createdAt)}</span>
                  </div>
                </div>

                {/* ORDER ITEMS */}
                <div className="p-5 sm:p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Ordered Products
                  </h3>

                  <div className="space-y-4">
                    {order.items?.map((item, index) => (
                      <div
                        key={item._id || `${item.productId}-${index}`}
                        className="flex justify-between items-start gap-4"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            Size: {item.size} · Quantity: {item.quantity}
                          </p>

                          <p className="text-sm text-gray-500">
                            Unit price: {formatPrice(item.price)}
                          </p>
                        </div>

                        <p className="font-semibold text-gray-900 whitespace-nowrap">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <OrderTracker status={order.orderStatus} />

                  {/* ORDER SUMMARY */}
                  <div className="border-t border-gray-100 mt-6 pt-5">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(order.subtotal)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">Shipping Fee</span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(order.shippingFee)}
                        </span>
                      </div>

                      <div className="flex justify-between border-t border-gray-100 pt-4">
                        <span className="font-bold text-gray-900 text-base">
                          Total Amount
                        </span>

                        <span className="font-bold text-orange-600 text-lg">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PAYMENT METHOD */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-5">
                    <FiCreditCard className="text-orange-600" />
                    <span>Payment method:</span>
                    <span className="font-semibold text-gray-900 uppercase">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONTINUE SHOPPING */}
        {orders.length > 0 && (
          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/")}
              className="bg-black hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
