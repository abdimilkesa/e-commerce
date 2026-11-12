import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [validToken, setValidToken] = useState(false);

  // Verify reset link and identify the account.
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/reset-password/${token}`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Invalid reset link.");
        }

        setEmail(data.email);
        setValidToken(true);
      } catch (error) {
        toast.error(error.message);
        setValidToken(false);
      } finally {
        setChecking(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setChecking(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed.");
      }

      toast.success(data.message);
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Verifying your reset link...</p>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900">
            Invalid or Expired Link
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Please request a new password reset link.
          </p>

          <Link
            to="/forgot-password"
            className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Password
        </h1>

        <div className="mt-5 rounded-lg bg-orange-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Account being recovered
          </p>

          <p className="mt-1 font-semibold text-orange-700">{email}</p>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              New Password
            </label>

            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Confirm New Password
            </label>

            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !validToken}
            className="w-full rounded-lg bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

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

export default ResetPassword;
