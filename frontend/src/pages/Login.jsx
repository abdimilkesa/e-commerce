import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // Save authentication information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect according to account role
      if (data.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold italic tracking-tight text-gray-950">
            Welcome Back<span className="text-orange-500">.</span>
          </h1>

          <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-400">
            Login to the Fashion Wave
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            autoComplete="email"
            required
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
          />

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-orange-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gray-950 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition duration-300 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 border-t border-gray-100 pt-6 text-center">
          <p className="text-sm text-gray-500">Don't have an account yet?</p>

          <Link
            to="/register"
            className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-gray-200 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-gray-900 transition duration-300 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600"
          >
            Create Account
          </Link>
        </div>

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
