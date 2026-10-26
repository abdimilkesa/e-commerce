import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Connect your registration API here later.
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl sm:p-10">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold italic tracking-tight text-gray-950">
            Sign Up<span className="text-orange-500">.</span>
          </h1>

          <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
            Join the Fashion Wave
          </p>
        </div>

        {/* Create Account Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            autoComplete="name"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            autoComplete="email"
            required
            className="w-full rounded-xl bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-100"
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password (minimum 8 characters)"
            autoComplete="new-password"
            minLength={8}
            required
            className="w-full rounded-xl bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-100"
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            autoComplete="new-password"
            minLength={8}
            required
            className="w-full rounded-xl bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-orange-100"
          />

          {/* Login Link */}
          <div className="flex items-center justify-between gap-3 pt-1 text-[11px] font-bold uppercase tracking-wider">
            <span className="text-gray-400">Already a member?</span>

            <Link
              to="/login"
              className="text-orange-600 transition hover:text-orange-700"
            >
              Login Here
            </Link>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-gray-950 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-orange-600"
          >
            Create Account
          </button>
        </form>

        {/* Terms */}
        <p className="mt-6 text-center text-xs leading-5 text-gray-400">
          By creating an account, you agree to our{" "}
          <Link
            to="/terms"
            className="text-orange-600 transition hover:underline"
          >
            Terms of Use
          </Link>
          .
        </p>

        {/* Back to Shopping */}
        <div className="mt-5 text-center">
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

export default Register;
