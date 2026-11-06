import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const order = state?.order;

  const [loading, setLoading] = useState(false);

  const handlePayment = async (outcome) => {
    if (!order?._id) {
      toast.error("Order information is missing.");
      return;
    }

    // Get authentication token
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to continue.");
      navigate("/login");
      return;
    }

    if (order.paymentStatus !== "pending") {
      toast.error("This order has already been processed.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/payments/simulate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: order._id,
            outcome,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Payment failed.");
      }

      if (outcome === "success") {
        toast.success("Test payment successful!");
      } else {
        toast.error("Test payment failed.");
      }

      navigate("/payment-result", {
        replace: true,
        state: { order: data.order },
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold">No order found</h2>

        <button
          onClick={() => navigate("/cart")}
          className="mt-4 bg-black text-white px-6 py-3"
        >
          Return to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-32">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Complete Your Payment</h1>

        <p className="text-gray-500 mb-8">Order ID: {order._id}</p>

        <div className="border rounded-lg p-5 mb-6">
          <p className="text-gray-500 text-sm">Total Amount</p>

          <h2 className="text-3xl font-bold mt-2">{order.totalAmount} Birr</h2>

          <div className="mt-5 flex justify-between">
            <span className="text-gray-500">Payment Method</span>

            <span className="font-semibold uppercase">
              {order.paymentMethod}
            </span>
          </div>

          <div className="mt-3 flex justify-between">
            <span className="text-gray-500">Payment Status</span>

            <span className="font-semibold">{order.paymentStatus}</span>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-orange-800">
            Test mode: These buttons simulate payment results. They do not
            transfer real money or connect to a payment provider.
          </p>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            disabled={loading || order.paymentStatus !== "pending"}
            onClick={() => handlePayment("success")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Processing..." : "Simulate Successful Payment"}
          </button>

          <button
            type="button"
            disabled={loading || order.paymentStatus !== "pending"}
            onClick={() => handlePayment("failed")}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Processing..." : "Simulate Failed Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
