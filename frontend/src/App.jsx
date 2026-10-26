import React from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Collection from "./pages/Collection";
import Order from "./pages/Order";
import Logout from "./pages/Logout";
import ShopContextProvider from "./context/ShopContext";

const App = () => {
  return (
    <ShopContextProvider>
      <div className="text-2xl text-green-600">
        <ToastContainer />
        <Navbar />

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/category/:category" element={<Collection />} />
        </Routes>

        <Footer />
      </div>
    </ShopContextProvider>
  );
};

export default App;
