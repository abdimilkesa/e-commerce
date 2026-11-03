import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { FiRefreshCw, FiShield, FiTruck } from "react-icons/fi";
import RelatedProduct from "../components/RelatedProduct";

const Product = () => {
  const { productId } = useParams();

  // Get products, currency and addToCart from ShopContext
  const { products, currency, addToCart } = useContext(ShopContext);

  const [productsData, setProductsData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  // Find selected product
  useEffect(() => {
    const fetchProductData = () => {
      const product = products.find((item) => item._id === productId);

      if (product) {
        setProductsData(product);
        setImage(product.image[0]);
        setSize("");
      } else {
        setProductsData(null);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [productId, products]);

  // Add selected product to cart
  const handleAddToCart = () => {
    if (!size) {
      return;
    }

    addToCart(productsData._id, size);
  };

  return productsData ? (
    <div className="bg-white px-4 pb-20 pt-28 text-slate-900 sm:px-8 lg:px-16">
      {/* Main Product Section */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
        {/* Left Image Gallery */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          {/* Thumbnail Images */}
          <div className="flex gap-3 overflow-x-auto sm:w-20 sm:shrink-0 sm:flex-col">
            {productsData.image.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setImage(item)}
                className={`h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 bg-gray-50 transition ${
                  image === item
                    ? "border-orange-500"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={item}
                  alt={`${productsData.name} ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>

          {/* Main Product Image */}
          <div className="flex-1 overflow-hidden rounded-lg bg-gray-50">
            <img
              src={image}
              alt={productsData.name}
              className="h-full max-h-[650px] min-h-[350px] w-full object-contain transition duration-500 hover:scale-105 sm:min-h-[500px]"
            />
          </div>
        </div>

        {/* Right Product Details */}
        <div className="flex flex-col pt-2">
          {/* Breadcrumb */}
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-400">
            <span>Home</span>
            <span>/</span>
            <span>{productsData.category}</span>
            <span>/</span>
            <span className="text-gray-600">{productsData.name}</span>
          </nav>

          {/* Product Name */}
          <h1 className="mb-5 text-2xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
            {productsData.name}
          </h1>

          {/* Price and Stock */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <p className="text-2xl font-bold text-orange-600 sm:text-3xl">
              {currency}
              {productsData.price}
            </p>

            <span className="rounded-sm bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
              In Stock
            </span>
          </div>

          {/* Description */}
          <p className="mb-8 max-w-xl text-sm leading-7 text-gray-500">
            {productsData.description}
          </p>

          {/* Size Selector */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-extrabold uppercase tracking-widest">
                Select Size
              </p>

              <button
                type="button"
                className="text-xs font-medium text-orange-600 underline underline-offset-4 transition hover:text-orange-700"
              >
                Size Guide
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {productsData.sizes.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSize(item)}
                  className={`flex h-11 min-w-11 items-center justify-center rounded-md border px-4 text-sm font-semibold transition ${
                    size === item
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Bag Button */}
          <button
            type="button"
            disabled={!size}
            onClick={handleAddToCart}
            className="mb-9 w-full rounded-xl bg-slate-950 px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {!size ? "Select a Size" : "Add to Bag"}
          </button>

          {/* Policies */}
          <div className="space-y-5 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <FiTruck className="shrink-0 text-lg text-orange-500" />
              <p>Free express delivery on orders over {currency} 150</p>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <FiShield className="shrink-0 text-lg text-orange-500" />
              <p>Secure payment platform</p>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500">
              <FiRefreshCw className="shrink-0 text-lg text-orange-500" />
              <p>30-day hassle-free return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description and Reviews */}
      <section className="mx-auto mt-20 max-w-7xl">
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            className="border-b-2 border-orange-500 px-6 py-4 text-sm font-bold text-slate-950"
          >
            Description
          </button>

          <button
            type="button"
            className="px-6 py-4 text-sm font-medium text-gray-400 transition hover:text-slate-950"
          >
            Reviews
          </button>
        </div>

        <div className="border-b border-x border-gray-100 px-5 py-8 text-sm leading-7 text-gray-500 sm:px-8">
          <p className="mb-4">
            Crafted from premium materials, this piece is designed to be a
            versatile staple in your wardrobe. Every detail, from the reinforced
            stitching to the custom-branded hardware, reflects our commitment to
            quality.
          </p>

          <p>
            Pair it with our signature denim for a casual daytime look, or
            elevate it with tailored trousers for evening outings.
          </p>
        </div>

        {/* Product Highlights */}
        <div className="mt-10">
          <h2 className="mb-5 text-xl font-bold text-slate-950">
            Product Highlights
          </h2>

          <ul className="grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "100% Organic Cotton",
              "Breathable fabric",
              "True to size fit",
              "Machine washable",
              "Eco-friendly dyes",
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Related Products */}
        <div>
          <RelatedProduct category={productsData.category} />
        </div>
      </section>
    </div>
  ) : (
    <div className="flex min-h-[60vh] items-center justify-center bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-orange-500" />
    </div>
  );
};

export default Product;
