import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  FiMenu,
  FiX,
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiExternalLink,
  FiChevronRight,
  FiMoon,
  FiSun,
  FiSettings,
} from "react-icons/fi";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const getStoredTheme = () => {
  try {
    return localStorage.getItem("gebeya-admin-theme") === "dark";
  } catch {
    return false;
  }
};

const navigation = [
  { label: "Dashboard", path: "/admin", icon: FiGrid },
  { label: "Products", path: "/admin/products", icon: FiPackage },
  { label: "Orders", path: "/admin/orders", icon: FiShoppingBag },
  { label: "Customers", path: "/admin/customers", icon: FiUsers },
  { label: "Settings", path: "/admin/settings", icon: FiSettings },
];

const AdminLayout = ({ title, subtitle, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(getStoredTheme);

  const location = useLocation();

  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    const updateUser = () => {
      setUser(getStoredUser());
    };

    window.addEventListener("storage", updateUser);
    window.addEventListener("adminProfileUpdated", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("adminProfileUpdated", updateUser);
    };
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("gebeya-admin-theme", darkMode ? "dark" : "light");
    } catch {
      // Theme still works for the current session.
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`admin-theme min-h-screen transition-colors duration-300 ${
        darkMode
          ? "admin-dark bg-slate-950 text-slate-100"
          : "bg-[#f5f7fb] text-slate-800"
      }`}
    >
      {/* Dark mode styles for all admin pages */}
      <style>{`
        .admin-dark {
          color-scheme: dark;
        }

        .admin-dark [class*="bg-white"] {
          background-color: #1e293b !important;
        }

        .admin-dark [class*="bg-gray-50"],
        .admin-dark [class*="bg-slate-50"] {
          background-color: #172033 !important;
        }

        .admin-dark [class*="bg-gray-100"],
        .admin-dark [class*="bg-slate-100"] {
          background-color: #273449 !important;
        }

        .admin-dark [class*="text-gray-900"],
        .admin-dark [class*="text-slate-900"],
        .admin-dark [class*="text-gray-800"],
        .admin-dark [class*="text-slate-800"],
        .admin-dark [class*="text-gray-700"],
        .admin-dark [class*="text-slate-700"] {
          color: #f1f5f9 !important;
        }

        .admin-dark [class*="text-gray-600"],
        .admin-dark [class*="text-slate-600"],
        .admin-dark [class*="text-gray-500"],
        .admin-dark [class*="text-slate-500"],
        .admin-dark [class*="text-gray-400"],
        .admin-dark [class*="text-slate-400"] {
          color: #a7b4c7 !important;
        }

        .admin-dark [class*="border-gray-"],
        .admin-dark [class*="border-slate-"] {
          border-color: #334155 !important;
        }

        .admin-dark input,
        .admin-dark select,
        .admin-dark textarea {
          background-color: #172033;
          color: #f1f5f9;
          border-color: #475569;
        }

        .admin-dark input::placeholder,
        .admin-dark textarea::placeholder {
          color: #94a3b8;
        }

        .admin-dark table thead {
          background-color: #172033;
        }

        .admin-dark table tbody tr {
          border-color: #334155;
        }

        .admin-dark table tbody tr:hover {
          background-color: #273449;
        }

        .admin-dark button:hover,
        .admin-dark a:hover {
          transition: background-color 0.2s ease;
        }

        .admin-dark [class*="hover:bg-gray-"]:hover,
        .admin-dark [class*="hover:bg-slate-"]:hover {
          background-color: #334155 !important;
        }

        .admin-dark [class*="divide-gray-"] > * + *,
        .admin-dark [class*="divide-slate-"] > * + * {
          border-color: #334155 !important;
        }
      `}</style>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r transition-transform duration-300 ${
          darkMode
            ? "border-slate-700 bg-slate-900"
            : "border-slate-200 bg-white"
        } ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div
          className={`flex h-[76px] items-center justify-between border-b px-6 ${
            darkMode ? "border-slate-700" : "border-slate-100"
          }`}
        >
          <Link to="/admin" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              G
            </span>

            <span>
              <span
                className={`block text-base font-bold tracking-tight ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Gebeya Admin
              </span>
              <span className="block text-xs text-slate-400">
                Store management
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-5 pt-8">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Menu
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-blue-600/10 text-blue-500"
                      : darkMode
                      ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="text-[18px]" />
                  {item.label}

                  {active && <FiChevronRight className="ml-auto" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom */}
        <div
          className={`mt-auto border-t p-5 ${
            darkMode ? "border-slate-700" : "border-slate-100"
          }`}
        >
          <Link
            to="/"
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800 hover:text-blue-400"
                : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <FiExternalLink className="text-lg" />
            Visit main store
          </Link>

          <div
            className={`mt-4 flex items-center gap-3 rounded-xl p-3 ${
              darkMode ? "bg-slate-800" : "bg-slate-50"
            }`}
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Admin profile"
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {(user?.name || "A").charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p
                className={`truncate text-sm font-semibold ${
                  darkMode ? "text-white" : "text-slate-800"
                }`}
              >
                {user?.name || "Administrator"}
              </p>

              <p className="truncate text-xs text-slate-400">
                {user?.email || "Administrator"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-h-screen lg:pl-[260px]">
        {/* Topbar */}
        <header
          className={`sticky top-0 z-30 flex h-[76px] items-center justify-between border-b px-4 backdrop-blur sm:px-7 lg:px-9 ${
            darkMode
              ? "border-slate-700 bg-slate-900/95"
              : "border-slate-200 bg-white/95"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className={`rounded-lg border p-2 lg:hidden ${
                darkMode
                  ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              aria-label="Open menu"
            >
              <FiMenu size={20} />
            </button>

            <div>
              <p
                className={`text-sm font-semibold ${
                  darkMode ? "text-white" : "text-slate-800"
                }`}
              >
                {title}
              </p>
              <p className="hidden text-xs text-slate-400 sm:block">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition ${
                darkMode
                  ? "border-slate-700 bg-slate-800 text-yellow-400 hover:bg-slate-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {darkMode ? <FiSun size={19} /> : <FiMoon size={19} />}
            </button>

            {/* Admin Profile */}

            {/* Admin Profile */}
            <div className="flex items-center gap-3">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user?.name || "Admin"}
                  className="h-10 w-10 rounded-full border-2 border-blue-500 object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {(user?.name || "A").charAt(0).toUpperCase()}
                </div>
              )}

              <div className="hidden sm:block">
                <p
                  className={`text-sm font-semibold ${
                    darkMode ? "text-white" : "text-slate-800"
                  }`}
                >
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>

              <Link
                to="/admin/settings"
                title="Edit profile"
                className={`rounded-lg p-2 ${
                  darkMode
                    ? "text-slate-300 hover:bg-slate-800"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <FiSettings size={18} />
              </Link>
            </div>

            <Link
              to="/"
              className={`hidden items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition sm:inline-flex ${
                darkMode
                  ? "border-slate-700 text-slate-300 hover:border-blue-500 hover:text-blue-400"
                  : "border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              View Store <FiExternalLink />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="mx-auto min-h-[calc(100vh-190px)] max-w-[1500px] p-4 sm:p-6 lg:p-9">
          {children}
        </main>

        {/* Admin Footer */}
        <footer
          className={`border-t ${
            darkMode
              ? "border-slate-700 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-5 px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3
                className={`text-lg font-extrabold tracking-wide ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                GEBEYA<span className="text-blue-600">.</span>
                <span className="ml-2 text-xs font-medium tracking-normal text-gray-400">
                  ADMIN
                </span>
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Your store. Your control. Your business.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-gray-500">
              <Link to="/admin" className="transition hover:text-blue-600">
                Dashboard
              </Link>
              <Link
                to="/admin/products"
                className="transition hover:text-blue-600"
              >
                Products
              </Link>
              <Link
                to="/admin/orders"
                className="transition hover:text-blue-600"
              >
                Orders
              </Link>
              <Link
                to="/admin/customers"
                className="transition hover:text-blue-600"
              >
                Customers
              </Link>
              <Link
                to="/admin/settings"
                className="transition hover:text-blue-600"
              >
                Settings
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>

              <span className="text-xs font-medium text-gray-500">
                Admin workspace
              </span>
            </div>
          </div>

          <div
            className={`border-t px-5 py-4 sm:px-8 ${
              darkMode
                ? "border-slate-700 bg-slate-950"
                : "border-gray-100 bg-gray-50"
            }`}
          >
            <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} Gebeya. Admin Dashboard.
              </p>

              <p className="text-xs text-gray-400">
                Designed for smarter store management.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
