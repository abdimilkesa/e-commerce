import React from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiExternalLink,
  FiArrowRight,
  FiActivity,
  FiSettings,
} from "react-icons/fi";

import AdminLayout from "../components/AdminLayout";

const AdminHome = () => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const sections = [
    {
      title: "Products",
      description:
        "Add products, edit details, update prices, and manage your store inventory.",
      icon: <FiPackage />,
      path: "/admin/products",
      label: "Manage Products",
    },
    {
      title: "Orders",
      description:
        "View customer orders, monitor payments, and update delivery statuses.",
      icon: <FiShoppingBag />,
      path: "/admin/orders",
      label: "Manage Orders",
    },
    {
      title: "Customers",
      description:
        "View registered customers and explore their shopping and order histories.",
      icon: <FiUsers />,
      path: "/admin/customers",
      label: "Manage Customers",
    },
    {
      title: "View Store",
      description:
        "Visit your online store and see how your products appear to customers.",
      icon: <FiExternalLink />,
      path: "/",
      label: "Visit Store",
      external: true,
    },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Overview of your store and management sections"
    >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 items-center gap-8 p-6 sm:p-8 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                <FiActivity />
                Store Management
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Welcome back, {user?.name || "Administrator"}!
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
                Manage your products, monitor customer orders, and keep track of
                your customers from one central dashboard.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/admin/products"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Manage Your Store
                  <FiArrowRight />
                </Link>

                <Link
                  to="/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Visit Website
                  <FiExternalLink />
                </Link>
              </div>
            </div>

            <div className="hidden items-center justify-center lg:flex">
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-blue-50">
                <div className="flex h-36 w-36 items-center justify-center rounded-full bg-blue-100">
                  <FiSettings className="text-7xl text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 sm:px-8">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">Gebeya Admin</span>{" "}
              · Your central store management workspace.
            </p>
          </div>
        </div>

        {/* Management Sections Heading */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">Store Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Select a section to manage your online store.
          </p>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {sections.map((section) => (
            <Link
              key={section.title}
              to={section.path}
              target={section.external ? "_blank" : undefined}
              rel={section.external ? "noreferrer" : undefined}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  {section.icon}
                </div>

                <FiArrowRight className="text-xl text-gray-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                {section.title}
              </h3>

              <p className="mt-3 min-h-[84px] text-sm leading-6 text-gray-500">
                {section.description}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm font-semibold text-blue-600">
                  {section.label}
                </span>
                <FiArrowRight className="text-blue-600 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHome;
