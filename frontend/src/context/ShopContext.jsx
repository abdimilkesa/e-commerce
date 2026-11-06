import { createContext, useState, useEffect } from "react";
import { product as localProducts } from "../assets/assets";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currency = "Birr";

  const [cartItems, setCartItems] = useState({});

  // Clear the entire cart
  const clearCart = () => {
    setCartItems({});
  };

  // Fetch products from MongoDB through Express API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error("Could not load products");
        }

        // Connect database products with existing local images
        const updatedProducts = data.products.map((dbProduct) => {
          const localProduct = localProducts.find(
            (item) =>
              item.id === dbProduct.legacyId || item._id === dbProduct.legacyId
          );

          return {
            ...dbProduct,
            image: localProduct?.image || dbProduct.image,
          };
        });

        setProducts(updatedProducts);
      } catch (err) {
        console.error("Product fetching error:", err);
        setError(err.message);
        toast.error("Unable to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add product to cart
  const addToCart = (itemId, size) => {
    if (!size) {
      toast.error("Select product size to continue");
      return;
    }

    setCartItems((prev) => {
      const updatedCart = { ...prev };

      if (!updatedCart[itemId]) {
        updatedCart[itemId] = {};
      }

      updatedCart[itemId] = {
        ...updatedCart[itemId],
        [size]: (updatedCart[itemId][size] || 0) + 1,
      };

      return updatedCart;
    });

    toast.success("Product added to cart successfully");
  };

  // Get total cart count
  const getCartCount = () => {
    let totalCount = 0;

    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        totalCount += cartItems[itemId][size];
      }
    }

    return totalCount;
  };

  // Update product quantity
  const updateQuantity = (itemId, size, quantity) => {
    setCartItems((prev) => {
      const cartData = { ...prev };

      if (!cartData[itemId]) return prev;

      cartData[itemId] = { ...cartData[itemId] };

      if (quantity <= 0) {
        delete cartData[itemId][size];
      } else {
        cartData[itemId][size] = quantity;
      }

      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }

      return cartData;
    });
  };

  // Calculate total cart amount
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const itemInfo = products.find((item) => item._id === itemId);

      if (itemInfo) {
        for (const size in cartItems[itemId]) {
          totalAmount += itemInfo.price * cartItems[itemId][size];
        }
      }
    }

    return totalAmount;
  };

  const value = {
    products,
    setProducts,
    loading,
    error,
    currency,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    clearCart,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
