import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const CartTotal = () => {
  const { currency, getCartAmount, getCartCount } = useContext(ShopContext);

  const navigate = useNavigate();

  const subtotal = getCartAmount();

  // Hide CartTotal when cart is empty
  if (getCartCount() === 0) {
    return null;
  }

  const shippingFee = 10;
  const total = subtotal + shippingFee;

  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg shadow-gray-200/60 border border-gray-100 p-7 sm:p-9 transition-all duration-300 hover:shadow-xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-indigo-500">
            Your Shopping Bag
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            Cart Summary
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Review your order details
          </p>
        </div>

        {/* Price Details */}
        <div className="space-y-5 text-sm">
          <div className="flex justify-between items-center text-gray-500">
            <span>Subtotal</span>
            <span className="font-semibold text-gray-800">
              {currency}
              {subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center text-gray-500">
            <span>Shipping Fee</span>
            <span className="font-semibold text-gray-800">
              {currency}
              {shippingFee.toFixed(2)}
            </span>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-5">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Total</span>

              <span className="text-2xl font-bold text-indigo-600">
                {currency}
                {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={() => navigate("/place-order")}
          className="w-full bg-black text-white px-8 py-4 mt-8 rounded-lg font-semibold hover:bg-orange-500 transition-all duration-300"
        >
          PROCEED TO CHECKOUT
        </button>

        <p className="text-center text-xs text-gray-400 mt-5">
          Secure checkout · Thank you for shopping with us
        </p>
      </div>
    </div>
  );
};

export default CartTotal;
