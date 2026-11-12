import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaRegCompass } from "react-icons/fa";
import { BiCart, BiChevronDown, BiUser } from "react-icons/bi";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const location = useLocation();
  const { getCartCount } = useContext(ShopContext);

  // Read authentication information
  const updateAuthState = () => {
    const currentToken = localStorage.getItem("token");
    let currentUser = null;

    try {
      currentUser = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      currentUser = null;
    }

    setToken(currentToken);
    setUser(currentUser);

    if (!currentToken) {
      setAccountOpen(false);
    }
  };

  useEffect(() => {
    updateAuthState();
  }, [location.pathname]);

  // Listen for authentication changes
  useEffect(() => {
    window.addEventListener("storage", updateAuthState);
    window.addEventListener("authChanged", updateAuthState);
    window.addEventListener("adminProfileUpdated", updateAuthState);

    return () => {
      window.removeEventListener("storage", updateAuthState);
      window.removeEventListener("authChanged", updateAuthState);
      window.removeEventListener("adminProfileUpdated", updateAuthState);
    };
  }, []);

  // Handle scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navlinks = [
    { name: "Men", path: "/category/Men" },
    { name: "Women", path: "/category/Women" },
    { name: "Kids", path: "/category/Kids" },
  ];

  const isLoggedIn = Boolean(token);
  const isAdmin = isLoggedIn && user?.role === "admin";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 transition-all duration-500">
      <div className="w-full max-w-7xl">
        <nav
          className={`flex items-center justify-between w-full px-6 rounded-2xl transition-all duration-500 ${
            scrolled
              ? "bg-white/90 backdrop-blur-lg shadow-md border border-gray-100 py-3"
              : "bg-white py-4"
          }`}
        >
          {/* Brand Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-500">
              <FaRegCompass className="text-white text-xl" />
            </div>

            <h2 className="text-xl font-black tracking-tighter text-gray-900">
              STYLE <span className="text-orange-500">WAVE</span>
            </h2>
          </Link>

          {/* Home */}
          <div>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative pb-2 text-xs uppercase tracking-wider transition-all duration-300
                after:absolute after:bottom-0 after:left-0 after:h-[2px]
                after:bg-orange-500 after:transition-all after:duration-300
                ${
                  isActive
                    ? "font-extrabold text-black after:w-full"
                    : "font-medium text-gray-500 after:w-0 hover:text-black"
                }`
              }
            >
              Home
            </NavLink>
          </div>

          {/* Original Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navlinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-black"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-orange-400" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Categories Dropdown for Smaller Screens */}
          <div className="relative md:hidden">
            <button
              type="button"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              aria-expanded={categoriesOpen}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-orange-500"
            >
              Categories
              <BiChevronDown
                className={`text-sm transition-transform ${
                  categoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {categoriesOpen && (
              <div className="absolute left-0 top-full mt-3 w-36 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                {navlinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setCategoriesOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-orange-50 text-orange-600"
                          : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Action Items */}
          <div className="flex items-center gap-4">
            {/* Account Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                aria-label="Account menu"
                aria-expanded={accountOpen}
                className="flex items-center gap-1 text-gray-700 hover:text-orange-500"
              >
                <BiUser className="text-xl" />
                <BiChevronDown className="text-sm" />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-full mt-3 w-48 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                  {/* Admin Dashboard */}
                  {isAdmin && (
                    <>
                      <Link
                        to="/admin"
                        onClick={() => setAccountOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50"
                      >
                        Admin Dashboard
                      </Link>

                      <hr className="my-1 border-gray-100" />
                    </>
                  )}

                  {/* Login */}
                  {!isLoggedIn && (
                    <Link
                      to="/login"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                    >
                      Login / Sign Up
                    </Link>
                  )}

                  {/* Logged-in User Options */}
                  {isLoggedIn && (
                    <>
                      <Link
                        to="/orders"
                        onClick={() => setAccountOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      >
                        My Orders
                      </Link>

                      <hr className="my-1 border-gray-100" />

                      <Link
                        to="/logout"
                        onClick={() => setAccountOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      >
                        Logout
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              to="/cart"
              aria-label="Shopping cart"
              className="relative text-gray-700 hover:text-orange-500"
            >
              <BiCart className="text-xl" />

              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
