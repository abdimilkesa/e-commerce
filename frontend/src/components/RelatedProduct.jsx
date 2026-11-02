import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const RelatedProduct = () => {
  const { products, currency } = useContext(ShopContext);
  const { productId } = useParams();

  const [relatedProducts, setRelatedProducts] = useState([]);

  // Find the current product and display products from the same category
  useEffect(() => {
    if (products.length > 0) {
      const currentProduct = products.find((item) => item._id === productId);

      if (currentProduct) {
        const filtered = products
          .filter(
            (item) =>
              item.category === currentProduct.category &&
              item._id !== productId
          )
          .slice(0, 4);

        setRelatedProducts(filtered);
      }
    }
  }, [productId, products]);

  return (
    <div className="mt-20">
      {/* Section Header */}
      <div className="mb-10 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">
          You might also like
        </span>

        <h2 className="mt-3 text-2xl font-bold text-slate-950 sm:text-3xl">
          Complete The <span className="text-orange-500">Look</span>
        </h2>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {relatedProducts.length > 0 ? (
          relatedProducts.map((product) => (
            <div key={product._id} className="group">
              <div className="relative overflow-hidden rounded-lg bg-gray-50">
                <Link to={`/product/${product._id}`}>
                  <img
                    src={product.image[0]}
                    alt={product.name}
                    className="h-56 w-full object-contain transition duration-500 group-hover:scale-105 sm:h-72"
                  />
                </Link>

                <div className="absolute inset-x-3 bottom-3">
                  <Link
                    to={`/product/${product._id}`}
                    className="block rounded-md bg-white px-4 py-3 text-center text-xs font-semibold text-slate-950 shadow-sm transition hover:bg-slate-950 hover:text-white"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="line-clamp-2 text-sm font-medium text-slate-800">
                  {product.name}
                </h3>

                <p className="mt-2 text-sm font-bold text-orange-600">
                  {currency}
                  {product.price}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-sm text-gray-500">
            Nothing in related products yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedProduct;
