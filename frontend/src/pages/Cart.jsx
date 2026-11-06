import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import CartTotal from "../components/CartTotal";
import { FiTrash2 } from "react-icons/fi";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity } =
    useContext(ShopContext);

  const cartData = Object.entries(cartItems || {}).flatMap(([itemId, sizes]) =>
    Object.entries(sizes || {})
      .filter(([, quantity]) => quantity > 0)
      .map(([size, quantity]) => ({
        _id: itemId,
        size,
        quantity,
      }))
  );

  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-20">
      {/* Headers */}
      <div className="pt-32 sm:pt-36 lg:pt-40 pb-6">
        {/* Cart Heading */}
        <div className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-gray-900">
            Your Bag <span className="text-orange-500">.</span>
          </h1>
        </div>

        {/* Cart Items */}
        <div className="space-y-7">
          {cartData.map((item) => {
            const productData = products.find(
              (product) => product._id === item._id
            );

            if (!productData) return null;

            return (
              <div
                key={`${item._id}-${item.size}`}
                className="flex items-center justify-between gap-4 sm:gap-8"
              >
                {/* Product Information */}
                <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                  {/* Product Image */}
                  <div className="w-16 h-20 sm:w-20 sm:h-24 shrink-0 overflow-hidden">
                    <img
                      src={productData.image[0]}
                      alt={productData.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-5">
                      {productData.name}
                    </h3>

                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-sm font-semibold text-gray-800">
                        {currency}
                        {productData.price}
                      </p>

                      <span className="text-xs text-gray-400 uppercase tracking-wide">
                        Size: {item.size}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity and Remove */}
                <div className="flex items-center gap-5 sm:gap-10 shrink-0">
                  {/* Quantity */}
                  <div className="flex flex-col items-center gap-1.5">
                    <label className="text-[10px] text-gray-400 uppercase tracking-widest">
                      Qty
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (value === "") return;

                        const quantity = Number(value);

                        if (Number.isInteger(quantity) && quantity >= 1) {
                          updateQuantity(item._id, item.size, quantity);
                        }
                      }}
                      className="w-11 h-8 text-center text-sm font-medium text-gray-800 border border-orange-300 rounded-lg outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    aria-label="Remove product"
                    className="text-gray-300 hover:text-orange-500 transition duration-200"
                  >
                    <FiTrash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-full sm:w-[450px]">
          <CartTotal />
        </div>

        {/* Empty Cart */}
        {cartData.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-sm">
              Your shopping bag is currently empty.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
