import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to send reset link.");
      }

      setSubmitted(true);
      toast.success(data.message || "Check your email for the reset link.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter your registered email address. We will send you a password reset
          link.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-700">
            If an account exists for that email, a password reset link has been
            sent. Check your inbox.
          </div>
        )}

        <Link
          to="/login"
          className="mt-6 block text-center text-sm text-orange-600 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
