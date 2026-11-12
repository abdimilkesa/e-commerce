import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove authentication information
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Notify Navbar and other components
    window.dispatchEvent(new Event("authChanged"));

    // Show logout message
    toast.success("Logged out successfully!");

    // Redirect to login page
    navigate("/login", { replace: true });
  }, [navigate]);

  return null;
};

export default Logout;
