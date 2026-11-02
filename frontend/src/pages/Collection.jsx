import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";

import { ShopContext } from "../context/ShopContext";
import { product } from "../assets/assets";

const Collection = () => {
  const { category } = useParams();
  const { currency } = useContext(ShopContext);

  // Filter products based on the selected category
  const filterProducts = product.filter(
    (item) => item.category?.toLowerCase() === (category || "").toLowerCase()
  );

  // Select the first product image for the banner
  const selectedBanner = filterProducts[0]?.image?.[0];

  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 pb-20">
      {/* Headers */}
      <div className="pt-32 sm:pt-36 lg:pt-40 pb-6">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[2px] text-gray-400 mb-5">
          <Link to="/" className="hover:text-orange-500 transition">
            Home
          </Link>

          <span>/</span>

          <span className="text-gray-800 font-semibold">{category}</span>
        </nav>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-gray-900">
            {category} Category
          </h1>

          <p className="text-xs sm:text-sm italic text-gray-500">
            Showing {filterProducts.length} results
          </p>
        </div>
      </div>

      {/* Banner section */}
      <div className="mt-2 mb-12">
        <div className="relative overflow-hidden rounded-sm bg-[#f8f6f2] min-h-[280px] sm:min-h-[350px] lg:min-h-[390px] grid grid-cols-1 md:grid-cols-2 items-center">
          {/* Banner image */}
          <div className="h-[260px] sm:h-[320px] md:h-full flex items-center justify-center p-5">
            {selectedBanner && (
              <img
                src={selectedBanner}
                alt={`${category} collection`}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Banner content */}
          <div className="text-center md:text-left px-6 sm:px-10 lg:px-14 py-8">
            <p className="text-xs uppercase tracking-[4px] text-gray-500 mb-4">
              StyleWave Collection
            </p>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-gray-900 mb-4">
              {category} Clothing
            </h2>

            <p className="text-gray-600 text-sm sm:text-base mb-7">
              Discover timeless styles designed for comfort, confidence and
              everyday elegance.
            </p>

            <a
              href="#collection-products"
              className="inline-block bg-[#98734f] hover:bg-[#795838] text-white px-8 py-3 text-sm transition duration-300"
            >
              Explore Collection
            </a>
          </div>
        </div>
      </div>

      {/* Product grid display */}
      <div id="collection-products">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-xl font-bold uppercase tracking-wide">
            Our Collection
          </h2>

          <p className="text-xs text-gray-500">
            {filterProducts.length} Products
          </p>
        </div>

        {filterProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
            {filterProducts.map((product) => (
              <div key={product._id} className="group">
                {/* Product image */}
                <div className="relative overflow-hidden bg-[#f7f7f7] aspect-[3/4]">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Quick Add button */}
                  <div className="absolute bottom-3 left-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition duration-300">
                    <Link
                      to={`/product/${product._id}`}
                      className="block w-full text-center bg-[#f5bd91] hover:bg-[#e9a775] text-gray-800 py-3 text-[10px] font-bold uppercase tracking-[2px] transition"
                    >
                      + Quick Add
                    </Link>
                  </div>
                </div>

                {/* Product information */}
                <div className="pt-3">
                  <h3 className="text-xs sm:text-sm font-semibold uppercase text-gray-800 leading-relaxed line-clamp-2 group-hover:text-orange-600 transition">
                    {product.name}
                  </h3>

                  <p className="text-sm font-bold text-gray-950 mt-2">
                    {currency}
                    {product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-800">
              No products found
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              We couldn't find products in this category.
            </p>

            <Link
              to="/"
              className="inline-block mt-6 bg-black text-white px-8 py-3 text-sm"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
