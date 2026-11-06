import React from "react";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Collection from "./pages/Collection";
import Order from "./pages/Order";
import PlaceOrder from "./pages/PlaceOrder";
import Payment from "./pages/Payment";
import PaymentResult from "./pages/PaymentResult";

import ShopContextProvider from "./context/ShopContext";

const App = () => {
  return (
    <ShopContextProvider>
      <div className="text-2xl text-green-600">
        <ToastContainer position="top-right" autoClose={3000} theme="light" />

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

          <Route path="/place-order" element={<PlaceOrder />} />

          <Route path="/payment" element={<Payment />} />

          <Route path="/payment-result" element={<PaymentResult />} />
        </Routes>

        <Footer />
      </div>
    </ShopContextProvider>
  );
};

export default App;
