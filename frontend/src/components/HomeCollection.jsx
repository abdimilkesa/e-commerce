import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiEye } from "react-icons/fi";
import { ShopContext } from "../context/ShopContext";

const HomeCollection = () => {
  const { products } = useContext(ShopContext);

  // Display the first 8 products
  const homeproducts = products.slice(9, 21);

  return (
    <div className="bg-white px-6 py-12 sm:px-10 lg:px-16">
      {/* Header */}
      <div className=" mb-16 w-full flex flex-col md:flex-row md:items-end jsutify-between mb-16 gap-16">
        <div>
          <span className="mb-3 block text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
            Curated Selection
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our{" "}
            <span className="font-light italic text-gray-400">Signature</span>{" "}
            Collections
          </h2>
        </div>

        <Link
          to="/collection"
          className="mt-6 w-48  block border-b border-gray-900 pb-3 text-sm font-bold uppercase tracking-widest text-gray-900"
        >
          View All Products
        </Link>
      </div>

      {/* Home Collection Display */}
      {homeproducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {homeproducts.map((product) => (
            <div key={product._id} className="group min-w-0">
              <div className="relative overflow-hidden bg-gray-50">
                <div className="absolute left-3 top-4 z-10 rounded-full bg-white px-3 py-1.5 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-900">
                    New
                  </p>
                </div>

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-[320px] w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-[300px] lg:h-[340px]  "
                />
                <div className="absolute inset-0 bg-gray-900/0 transition-colors duration-300 group-hover:bg-gray-900/20"></div>

                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button
                    type="button"
                    aria-label="Add to cart"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-md transition hover:bg-orange-500 hover:text-white"
                  >
                    <FiShoppingCart />
                  </button>

                  <Link
                    to={`/product/${product._id}`}
                    aria-label={`View ${product.name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-md transition hover:bg-orange-500 hover:text-white"
                  >
                    <FiEye />
                  </Link>
                </div>
              </div>

              <div className="pt-5">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400">
                    {product.category}
                  </p>

                  <p className="shrink-0 text-base font-bold text-gray-900">
                    {product.price}
                  </p>
                </div>

                <h3 className="text-sm font-semibold leading-6 text-gray-900 transition-colors group-hover:text-orange-600">
                  {product.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-sm text-gray-500">No product available</p>
        </div>
      )}
    </div>
  );
};

export default HomeCollection;
