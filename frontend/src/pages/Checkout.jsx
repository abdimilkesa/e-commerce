import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const { products, currency, cartItems, getCartAmount, getCartCount } =
    useContext(ShopContext);

  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    region: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("chapa");
  const [loading, setLoading] = useState(false);

  // Convert cart object into order items
  const cartData = Object.entries(cartItems || {}).flatMap(([itemId, sizes]) =>
    Object.entries(sizes || {})
      .filter(([, quantity]) => quantity > 0)
      .map(([size, quantity]) => ({
        productId: itemId,
        size,
        quantity,
      }))
  );

  const subtotal = getCartAmount();
  const shippingFee = 10;
  const total = subtotal + shippingFee;

  const handleCustomerChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartData.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        throw new Error(data.message || "Order creation failed");
      }

      toast.success("Your order was created successfully!");

      navigate("/payment", {
        state: {
          order: data.order,
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (getCartCount() === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <button
          onClick={() => navigate("/collection")}
          className="mt-5 bg-black text-white px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-32 pb-20">
      <h1 className="text-3xl font-bold mb-10">
        Checkout <span className="text-orange-500">.</span>
      </h1>

      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        {/* Customer Information */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-5">Customer Information</h2>

            <div className="space-y-4">
              <input
                name="name"
                value={customer.name}
                onChange={handleCustomerChange}
                placeholder="Full Name"
                required
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="email"
                name="email"
                value={customer.email}
                onChange={handleCustomerChange}
                placeholder="Email Address"
                required
                className="w-full border p-3 rounded-lg"
              />

              <input
                type="tel"
                name="phone"
                value={customer.phone}
                onChange={handleCustomerChange}
                placeholder="Phone Number"
                required
                className="w-full border p-3 rounded-lg"
              />
            </div>
          </section>

          {/* Delivery Information */}
          <section>
            <h2 className="text-xl font-semibold mb-5">Delivery Information</h2>

            <div className="space-y-4">
              <input
                name="address"
                value={shippingAddress.address}
                onChange={handleAddressChange}
                placeholder="Street / Delivery Address"
                required
                className="w-full border p-3 rounded-lg"
              />

              <input
                name="city"
                value={shippingAddress.city}
                onChange={handleAddressChange}
                placeholder="City"
                required
                className="w-full border p-3 rounded-lg"
              />

              <input
                name="region"
                value={shippingAddress.region}
                onChange={handleAddressChange}
                placeholder="Region"
                required
                className="w-full border p-3 rounded-lg"
              />
            </div>
          </section>

          {/* Payment Method */}
          <section>
            <h2 className="text-xl font-semibold mb-5">Payment Method</h2>

            <div className="space-y-3">
              {[
                { value: "chapa", label: "Chapa" },
                { value: "telebirr", label: "Telebirr" },
                { value: "bank", label: "Bank Transfer" },
              ].map((method) => (
                <label
                  key={method.value}
                  className="flex items-center gap-3 border p-4 rounded-lg cursor-pointer"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />

                  <span className="font-medium">{method.label}</span>
                </label>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Payment is currently in development test mode. No real payment
              will be collected.
            </p>
          </section>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-6">Your Order</h2>

          <div className="space-y-4">
            {cartData.map((item) => {
              const product = products.find((p) => p._id === item.productId);

              if (!product) return null;

              return (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex justify-between gap-4 border-b pb-4"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      Size: {item.size} × {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold">
                    {currency}
                    {(product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="space-y-4 mt-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                {currency}
                {subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {currency}
                {shippingFee.toFixed(2)}
              </span>
            </div>

            <div className="border-t pt-4 flex justify-between font-bold text-xl">
              <span>Total</span>
              <span className="text-orange-500">
                {currency}
                {total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-lg mt-8 font-semibold hover:bg-orange-500 transition disabled:opacity-50"
          >
            {loading ? "CREATING ORDER..." : "PLACE ORDER"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
