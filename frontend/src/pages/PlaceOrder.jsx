import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./PlaceOrder.css";

import {
  FiMapPin,
  FiTruck,
  FiCreditCard,
  FiShield,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";

import { ShopContext } from "../context/ShopContext";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const { products, currency, cartItems, getCartAmount, getCartCount } =
    useContext(ShopContext);

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("chapa");

  // Phone number state
  const [phone, setPhone] = useState("");
  const { clearCart } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    region: "",
  });

  const regions = [
    "Addis Ababa",
    "Afar",
    "Amhara",
    "Benishangul-Gumuz",
    "Central Ethiopia",
    "Dire Dawa",
    "Gambela",
    "Harari",
    "Oromia",
    "Sidama",
    "Somali",
    "South Ethiopia",
    "South West Ethiopia Peoples' Region",
  ];

  const subtotal = getCartAmount();
  const shippingFee = 10;
  const total = subtotal + shippingFee;

  const cartData = Object.entries(cartItems).flatMap(([productId, sizes]) =>
    Object.entries(sizes).map(([size, quantity]) => ({
      productId,
      size,
      quantity,
    }))
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the logged-in user's token
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in before placing your order.");
      navigate("/login");
      return;
    }

    if (cartData.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!phone || !isValidPhoneNumber(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      setLoading(true);

      const customer = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email: formData.email.trim(),
        phone: phone,
      };

      const shippingAddress = {
        address: formData.street.trim(),
        city: formData.city.trim(),
        region: formData.region,
      };

      const response = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer,
          shippingAddress,
          items: cartData,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to create order");
      }

      toast.success("Order created successfully!");
      clearCart();
      navigate("/payment", {
        state: { order: data.order },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-gray-400";

  const sectionTitle =
    "flex items-center gap-3 text-lg font-semibold text-gray-900";

  // Empty cart
  if (getCartCount() === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-5">
          <FiTruck className="text-orange-500 text-3xl" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Your bag is empty</h2>

        <p className="text-gray-500 mt-2 text-sm">
          Add something to your bag before checking out.
        </p>

        <button
          type="button"
          onClick={() => navigate("/collection")}
          className="mt-6 bg-black text-white px-7 py-3 rounded-lg hover:bg-orange-500 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-orange-500 text-xs font-bold uppercase tracking-[3px] mb-2">
            Secure Checkout
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-950">
            Complete Your Order
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Just a few details and your order will be ready.
          </p>

          <div className="flex items-center gap-2 mt-6 text-xs text-gray-500">
            <span className="text-orange-500 font-semibold">01 Bag</span>
            <span className="w-8 h-px bg-gray-300" />
            <span className="text-black font-semibold">02 Checkout</span>
            <span className="w-8 h-px bg-gray-300" />
            <span>03 Payment</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <section className="bg-white rounded-xl border border-gray-100 p-5 sm:p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <FiMapPin className="text-orange-500 text-lg" />
                  </div>

                  <div>
                    <h2 className={sectionTitle}>Contact Information</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Your details for order updates
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      required
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      required
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className={inputStyle}
                    />
                  </div>

                  {/* International Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>

                    <PhoneInput
                      international
                      defaultCountry="ET"
                      countryCallingCodeEditable={false}
                      value={phone}
                      onChange={setPhone}
                      placeholder="Enter phone number"
                      className="phone-input-custom"
                      required
                    />

                    <p className="text-xs text-gray-400 mt-2">
                      Select your country and enter your phone number.
                    </p>
                  </div>
                </div>
              </section>

              {/* Delivery Address */}
              <section className="bg-white rounded-xl border border-gray-100 p-5 sm:p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <FiTruck className="text-orange-500 text-lg" />
                  </div>

                  <div>
                    <h2 className={sectionTitle}>Delivery Address</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      required
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="House number, street name..."
                      className={inputStyle}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Your city"
                        className={inputStyle}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Region
                      </label>
                      <select
                        required
                        name="region"
                        value={formData.region}
                        onChange={handleChange}
                        className={inputStyle}
                      >
                        <option value="">Select region</option>
                        {regions.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="bg-white rounded-xl border border-gray-100 p-5 sm:p-7">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <FiCreditCard className="text-orange-500 text-lg" />
                  </div>

                  <div>
                    <h2 className={sectionTitle}>Payment Method</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Choose your preferred payment option
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: "chapa",
                      title: "Chapa",
                      description: "Test-mode payment option",
                      symbol: "C",
                    },
                    {
                      id: "telebirr",
                      title: "Telebirr",
                      description: "Test-mode payment option",
                      symbol: "T",
                    },
                    {
                      id: "bank",
                      title: "Bank Transfer",
                      description: "Test-mode payment option",
                      symbol: "B",
                    },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition ${
                        paymentMethod === method.id
                          ? "border-orange-500 bg-orange-50/50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="accent-orange-500"
                      />

                      <div className="w-10 h-10 rounded-lg bg-black text-orange-400 flex items-center justify-center font-bold">
                        {method.symbol}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {method.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {method.description}
                        </p>
                      </div>

                      {paymentMethod === method.id && (
                        <FiCheckCircle className="text-orange-500 text-xl" />
                      )}
                    </label>
                  ))}
                </div>

                <div className="mt-5 flex gap-3 bg-gray-50 rounded-lg p-4">
                  <FiShield className="text-orange-500 text-lg shrink-0" />
                  <p className="text-xs text-gray-500 leading-5">
                    Development mode: payment options are currently for testing
                    only. No real money will be transferred.
                  </p>
                </div>
              </section>
            </div>

            {/* Order Summary */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 lg:sticky lg:top-24">
                <h2 className="text-xl font-bold text-gray-950 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                  {Object.entries(cartItems).flatMap(([productId, sizes]) =>
                    Object.entries(sizes).map(([size, quantity]) => {
                      const item = products.find(
                        (product) => product._id === productId
                      );

                      if (!item) return null;

                      return (
                        <div
                          key={`${productId}-${size}`}
                          className="flex gap-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                          />

                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {item.name}
                            </h3>

                            <p className="text-xs text-gray-500 mt-1">
                              Size: {size} · Qty: {quantity}
                            </p>

                            <p className="text-sm font-semibold text-gray-900 mt-2">
                              {currency}{" "}
                              {(item.price * quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="border-t border-gray-100 my-6" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-medium">
                      {currency} {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-500">
                    <span>Delivery fee</span>
                    <span className="text-gray-900 font-medium">
                      {currency} {shippingFee.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 my-5" />

                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-orange-500">
                    {currency} {total.toLocaleString()}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-7 flex items-center justify-center gap-3 bg-black text-white py-4 rounded-lg font-semibold text-sm hover:bg-orange-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "PROCESSING..." : "PLACE ORDER"}
                  {!loading && <FiArrowRight />}
                </button>

                <p className="text-center text-xs text-gray-400 mt-4">
                  By placing your order, you agree to our terms.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
