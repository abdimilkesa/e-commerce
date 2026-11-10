import React from "react";
import { ToastContainer } from "react-toastify";
import { Routes, Route, useLocation } from "react-router-dom";

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

import AdminHome from "./pages/AdminHome";
import Admin from "./pages/Admin";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";

import ShopContextProvider from "./context/ShopContext";

const AppContent = () => {
  const location = useLocation();

  // Detect admin routes
  const isAdminRoute =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  return (
    <>
      <ToastContainer position="top-right" autoClose={1000} theme="light" />

      {/* Main Website Navbar */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Customer Pages */}
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

        {/* Admin Pages */}
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/orders" element={<Admin />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Routes>

      {/* Main Website Footer */}
      {!isAdminRoute && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <ShopContextProvider>
      <AppContent />
    </ShopContextProvider>
  );
};

export default App;
