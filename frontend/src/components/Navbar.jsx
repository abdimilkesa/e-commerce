import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaRegCompass } from "react-icons/fa";
import { BiCart, BiChevronDown, BiUser } from "react-icons/bi";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

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

          {/* Navigation */}
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

              {/* Show menu only when clicked */}
              {accountOpen && (
                <div className="absolute right-0 top-full mt-3 w-40 rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
                  <Link
                    to="/login"
                    onClick={() => setAccountOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    Login/Sign Up
                  </Link>

                  <hr className="my-1 border-gray-100" />

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
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              to="/cart"
              aria-label="Shopping cart"
              className="text-gray-700 hover:text-orange-500"
            >
              <BiCart className="text-xl" />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
