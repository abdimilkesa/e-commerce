import { createContext, useState } from "react";
import { product } from "../assets/assets";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState(product);
  const currency = "$";

  // Cart items state
  const [cartItems, setCartItems] = useState({});

  // Add product to cart
  const addToCart = (itemId, size) => {
    if (!size) {
      toast.error("Select product size to continue");
      return;
    }

    setCartItems((prev) => {
      const updateCart = { ...prev };

      if (!updateCart[itemId]) {
        updateCart[itemId] = {};
      }

      updateCart[itemId] = {
        ...updateCart[itemId],
        [size]: (updateCart[itemId][size] || 0) + 1,
      };

      return updateCart;
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

      // Remove product if no sizes remain
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }

      return cartData;
    });
  };

  // Get total cart amount
  const getCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);

      if (itemInfo) {
        for (const size in cartItems[itemId]) {
          totalAmount += itemInfo.price * cartItems[itemId][size];
        }
      }
    }

    return totalAmount;
  };

  // Context values
  const value = {
    products,
    setProducts,
    currency,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
