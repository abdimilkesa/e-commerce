import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiXCircle,
  FiShoppingBag,
  FiPackage,
  FiMapPin,
  FiUser,
  FiCreditCard,
  FiArrowLeft,
} from "react-icons/fi";

const PaymentResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state?.order;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-5">
        <FiPackage size={60} className="text-gray-400 mb-5" />

        <h2 className="text-2xl font-bold text-gray-900">No Order Found</h2>

        <p className="text-gray-500 mt-2 text-center">
          We couldn't find your order information.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-black hover:bg-orange-600 text-white px-7 py-3 rounded-lg transition"
        >
          Go Home
        </button>
      </div>
    );
  }

  const isPaid = order.paymentStatus === "paid";

  const formatPrice = (amount) =>
    `${Number(amount || 0).toLocaleString()} Birr`;

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-28">
      <div className="max-w-3xl mx-auto">
        {/* PAYMENT STATUS */}
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10 text-center">
          {isPaid ? (
            <FiCheckCircle size={65} className="text-green-500 mx-auto mb-5" />
          ) : (
            <FiXCircle size={65} className="text-red-500 mx-auto mb-5" />
          )}

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {isPaid ? "Payment Successful!" : "Payment Failed"}
          </h1>

          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            {isPaid
              ? "Your test payment was successful. Your order is now being processed."
              : "Your test payment was unsuccessful. Your order has not been paid."}
          </p>

          <div className="mt-6">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                isPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isPaid ? "PAID" : "UNPAID"}
            </span>
          </div>
        </div>

        {/* ORDER INFORMATION */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <FiPackage size={23} className="text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Order Information
            </h2>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <span className="text-gray-500">Order ID</span>
              <span className="font-medium text-gray-900 break-all sm:text-right">
                {order._id}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method</span>
              <span className="font-semibold text-gray-900 uppercase">
                {order.paymentMethod}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Payment Status</span>
              <span
                className={`font-semibold capitalize ${
                  isPaid ? "text-green-600" : "text-red-600"
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Order Status</span>
              <span className="font-semibold text-orange-600 capitalize">
                {order.orderStatus}
              </span>
            </div>
          </div>
        </div>

        {/* CUSTOMER INFORMATION */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <FiUser size={22} className="text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Customer Information
            </h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Full Name</span>
              <span className="font-medium text-gray-900 text-right">
                {order.customer?.name || "N/A"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-900 text-right break-all">
                {order.customer?.email || "N/A"}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium text-gray-900">
                {order.customer?.phone || "N/A"}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-6 pt-6">
            <div className="flex items-center gap-2 mb-3">
              <FiMapPin className="text-orange-600" />
              <h3 className="font-semibold text-gray-900">Shipping Address</h3>
            </div>

            <p className="text-sm text-gray-600">
              {order.shippingAddress?.address || "N/A"},{" "}
              {order.shippingAddress?.city || "N/A"},{" "}
              {order.shippingAddress?.region || "N/A"}
            </p>
          </div>
        </div>

        {/* ORDERED PRODUCTS */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <FiShoppingBag size={22} className="text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Ordered Products
            </h2>
          </div>

          <div className="space-y-5">
            {order.items?.map((item, index) => (
              <div
                key={item._id || `${item.productId}-${index}`}
                className="flex justify-between items-start gap-4 border-b border-gray-100 pb-5 last:border-0"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Size: {item.size}
                  </p>

                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <span className="font-semibold text-gray-900 whitespace-nowrap">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <FiCreditCard size={22} className="text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
          </div>

          <div className="space-y-4 text-sm">
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

            <div className="border-t border-gray-200 pt-4 flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total</span>

              <span className="text-xl font-bold text-orange-600">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate("/orders")}
            className="flex-1 border border-gray-300 hover:border-black text-gray-900 py-3 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <FiPackage />
            My Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-black hover:bg-orange-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <FiShoppingBag />
            Continue Shopping
          </button>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 mx-auto mt-6 text-sm text-gray-500 hover:text-orange-600 transition"
        >
          <FiArrowLeft />
          Back to Home
        </button>

        <p className="text-xs text-center text-gray-400 mt-8">
          This order confirmation is part of the project's payment test mode.
        </p>
      </div>
    </div>
  );
};

export default PaymentResult;
