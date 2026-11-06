import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import {
  FiMapPin,
  FiTruck,
  FiCreditCard,
  FiShield,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

const PlaceOrder = () => {
  const { currency, getCartAmount, getCartCount } = useContext(ShopContext);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Ethiopia",
  });

  const subtotal = getCartAmount();
  const shippingFee = 10;
  const total = subtotal + shippingFee;

  const inputStyle =
    "w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all duration-300 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100";

  const regions = [
    "Afar",
    "Amhara",
    "Benishangul-Gumuz",
    "Central Ethiopia",
    "Gambela",
    "Harari",
    "Oromia",
    "Sidama",
    "Somali",
    "South Ethiopia",
    "South West Ethiopia Peoples' Region",
    "Addis Ababa",
    "Dire Dawa",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE ORDER SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isProcessing) return;

    if (paymentMethod === "cod") {
      console.log("Delivery Information:", formData);
      console.log("Payment Method: Cash on Delivery");
      console.log("Order Total:", total);

      alert("Your order has been submitted!");
      return;
    }

    try {
      setIsProcessing(true);

      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: formData,
          amount: total,
          currency: currency,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.checkout_url) {
        throw new Error(data.message || "Unable to initialize payment.");
      }

      window.location.href = data.checkout_url;
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.message || "Payment initialization failed.");
      setIsProcessing(false);
    }
  };

  // EMPTY CART
  if (getCartCount() === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-5">
        <h2 className="text-2xl font-bold text-gray-900">Your bag is empty</h2>

        <p className="text-gray-500 mt-2">
          Add some products before proceeding to checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-12">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-orange-500 mb-3">
            Almost Yours
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Checkout
          </h1>

          <p className="text-sm text-gray-500 mt-3">
            Complete your information and get your order delivered.
          </p>

          {/* CHECKOUT PROGRESS */}
          <div className="flex items-center gap-3 mt-7 max-w-md">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs">
                <FiCheckCircle />
              </span>

              <span className="text-xs font-semibold text-gray-900">
                Shopping Bag
              </span>
            </div>

            <div className="flex-1 h-px bg-orange-400"></div>

            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                02
              </span>

              <span className="text-xs font-bold text-orange-500">
                Checkout
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-7">
              {/* DELIVERY INFORMATION */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                    <FiMapPin size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Delivery Information
                    </h2>

                    <p className="text-xs text-gray-400 mt-1">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className={inputStyle}
                  />

                  <input
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className={inputStyle}
                  />

                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className={inputStyle}
                  />

                  <input
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className={inputStyle}
                  />

                  <input
                    required
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Street Address"
                    className={`${inputStyle} sm:col-span-2`}
                  />

                  <input
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={inputStyle}
                  />

                  {/* ETHIOPIAN REGIONS */}
                  <select
                    required
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`${inputStyle} cursor-pointer`}
                  >
                    <option value="" disabled>
                      Select Region / City Administration
                    </option>

                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>

                  <input
                    required
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Postal Code"
                    className={inputStyle}
                  />

                  <input
                    required
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                    <FiCreditCard size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Payment Method
                    </h2>

                    <p className="text-xs text-gray-400 mt-1">
                      Choose your preferred payment option.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* CASH ON DELIVERY */}
                  <label
                    className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      paymentMethod === "cod"
                        ? "border-orange-500 bg-orange-50/50"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          paymentMethod === "cod"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <FiTruck size={21} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Cash on Delivery
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Pay when your order arrives.
                        </p>
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="w-4 h-4 accent-orange-500"
                    />
                  </label>

                  {/* CARD PAYMENT */}
                  <label
                    className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      paymentMethod === "card"
                        ? "border-orange-500 bg-orange-50/50"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                          paymentMethod === "card"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <FiCreditCard size={21} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Credit / Debit Card
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Online card payment.
                        </p>
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="w-4 h-4 accent-orange-500"
                    />
                  </label>
                </div>

                {/* ONLINE CARD PAYMENT INTERFACE */}
                {paymentMethod === "card" && (
                  <div className="mt-6 p-5 sm:p-6 rounded-2xl border border-orange-200 bg-orange-50/40">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">
                          Online Card Payment
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          Securely complete your payment online.
                        </p>
                      </div>

                      <FiShield className="text-orange-500" size={23} />
                    </div>

                    {/* CARD PREVIEW */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-6 text-white shadow-lg mb-6">
                      <div className="flex justify-between items-center">
                        <FiCreditCard size={28} />

                        <span className="text-xs tracking-widest font-semibold">
                          SECURE PAYMENT
                        </span>
                      </div>

                      <p className="text-xl tracking-[0.2em] font-semibold mt-8">
                        •••• •••• •••• ••••
                      </p>

                      <div className="flex justify-between mt-6">
                        <div>
                          <p className="text-[9px] text-gray-300 tracking-widest">
                            CARDHOLDER
                          </p>

                          <p className="text-sm font-medium mt-1">
                            Secure Checkout
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] text-gray-300 tracking-widest">
                            PAYMENT
                          </p>

                          <p className="text-sm font-medium mt-1">Online</p>
                        </div>
                      </div>
                    </div>

                    {/* PAYMENT AMOUNT */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-900 mb-2">
                        Payment Amount
                      </p>

                      <div className="flex justify-between items-center bg-white border border-gray-200 rounded-xl px-4 py-4">
                        <span className="text-sm text-gray-500">
                          Total to pay
                        </span>

                        <span className="text-lg font-bold text-orange-500">
                          {currency}
                          {total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* SECURITY MESSAGE */}
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex gap-3 items-start">
                        <FiShield className="text-green-600 mt-1 shrink-0" />

                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Secure Payment Gateway
                          </p>

                          <p className="text-xs text-gray-500 leading-relaxed mt-1">
                            You will be redirected to a secure payment provider
                            to enter your card details and authorize the
                            transaction. Your card information will not be
                            stored by our store.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECURITY MESSAGE */}
                <div className="flex items-start gap-3 mt-6 p-4 rounded-xl bg-gray-50">
                  <FiShield className="text-orange-500 mt-0.5 shrink-0" />

                  <p className="text-xs text-gray-500 leading-relaxed">
                    Your checkout information should be handled securely.
                    Payment details must be processed through a trusted payment
                    provider.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - ORDER SUMMARY */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-7 shadow-sm sticky top-24">
                <div className="mb-7">
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-orange-500">
                    Your Order
                  </p>

                  <h2 className="text-xl font-bold text-gray-900 mt-2">
                    Order Summary
                  </h2>
                </div>

                {/* PRICE DETAILS */}
                <div className="space-y-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>

                    <span className="font-semibold text-gray-900">
                      {currency}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping Fee</span>

                    <span className="font-semibold text-gray-900">
                      {currency}
                      {shippingFee.toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total</span>

                      <span className="text-2xl font-extrabold text-orange-500">
                        {currency}
                        {total.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 mt-2">
                      Shipping included in total.
                    </p>
                  </div>
                </div>

                {/* PLACE ORDER / PAY NOW */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 rounded-xl mt-8 text-sm font-bold tracking-wider hover:bg-orange-500 transition-all duration-300 hover:shadow-lg hover:shadow-orange-200 disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {isProcessing
                    ? "PROCESSING..."
                    : paymentMethod === "card"
                    ? "PAY NOW"
                    : "PLACE ORDER"}

                  {!isProcessing && (
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  )}
                </button>

                {/* SECURITY */}
                <div className="flex items-center justify-center gap-2 mt-5">
                  <FiShield className="text-green-600" />

                  <p className="text-[11px] text-gray-400">
                    Safe and secure checkout
                  </p>
                </div>

                <div className="border-t border-gray-100 mt-6 pt-5 text-center">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Thank you for choosing us.
                    <br />
                    Your style, your confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
