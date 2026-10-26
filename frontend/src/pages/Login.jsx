import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Connect your login API here later.
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl sm:p-10">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold italic tracking-tight text-gray-950">
            Welcome Back<span className="text-orange-500">.</span>
          </h1>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
            Login to the Fashion Wave
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            autoComplete="email"
            required
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            className="w-full rounded-xl bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-100"
          />

          {/* Forgot Password */}
          <div className="flex justify-end pt-1">
            <Link
              to="/forgot-password"
              className="text-[11px] font-bold uppercase tracking-wider text-gray-400 transition hover:text-orange-500"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-gray-950 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-orange-600"
          >
            Login
          </button>
        </form>

        {/* Create Account Section */}
        <div className="mt-6 border-t border-gray-100 pt-6 text-center">
          <p className="text-sm text-gray-500">Don't have an account yet?</p>

          <Link
            to="/register"
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-gray-200 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-gray-900 transition duration-300 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600"
          >
            Create Account
          </Link>
        </div>

        {/* Back to Shopping */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs text-gray-400 transition hover:text-orange-500"
          >
            ← Back to shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
