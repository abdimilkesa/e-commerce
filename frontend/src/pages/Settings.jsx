import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { toast } from "react-toastify";
import {
  FiUser,
  FiSettings,
  FiSave,
  FiLock,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBell,
  FiTool,
  FiCamera,
} from "react-icons/fi";

const API_URL = "http://localhost:5000/api";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profilePicture: "",
  });

  const [pictureUploading, setPictureUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  // Fetch administrator profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in again.");
        }

        const response = await fetch(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("Profile update response:", data);

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile.");
        }

        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          profilePicture: data.profilePicture || "",
        });
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Save profile information
  const handleProfileSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile.");
      }

      const updatedProfile = {
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        profilePicture: data.user.profilePicture || "",
      };

      setProfile(updatedProfile);

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          name: updatedProfile.name,
          email: updatedProfile.email,
          phone: updatedProfile.phone,
          profilePicture: updatedProfile.profilePicture,
        })
      );
      window.dispatchEvent(new Event("adminProfileUpdated"));

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      setChangingPassword(true);

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/profile/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password.");
      }

      toast.success("Password changed successfully!");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setChangingPassword(false);
    }
  };
  // Upload profile picture
  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate image type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    // Validate image size (2 MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must not exceed 2 MB.");
      e.target.value = "";
      return;
    }

    try {
      setPictureUploading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await fetch(`${API_URL}/profile/upload-picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Picture upload failed.");
      }

      // Update profile state immediately
      setProfile((previous) => ({
        ...previous,
        profilePicture: data.profilePicture,
      }));

      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          profilePicture: data.profilePicture,
        })
      );

      toast.success("Profile picture uploaded successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPictureUploading(false);
      e.target.value = "";
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your administrator profile and store configuration.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex flex-wrap gap-3 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === "profile"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <FiUser />
            Profile Settings
          </button>

          <button
            onClick={() => setActiveTab("system")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === "system"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <FiSettings />
            System Settings
          </button>
        </div>

        {/* Profile Settings */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Profile Picture */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-gray-900">
                Profile Picture
              </h2>

              <div className="flex flex-col items-center">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-400">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt="Admin Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FiUser size={48} />
                  )}
                </div>

                <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                  <FiCamera />
                  {pictureUploading ? "Uploading..." : "Choose Picture"}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleProfilePictureUpload}
                    disabled={pictureUploading}
                    className="hidden"
                  />
                </label>

                <p className="mt-3 text-center text-xs text-gray-400">
                  JPG, PNG or WEBP. Maximum size: 2 MB.
                </p>

                {pictureUploading && (
                  <p className="mt-2 text-sm font-medium text-blue-600">
                    Uploading picture...
                  </p>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="mb-5 text-lg font-bold text-gray-900">
                Personal Information
              </h2>

              {loading ? (
                <p className="py-8 text-center text-sm text-gray-500">
                  Loading administrator profile...
                </p>
              ) : (
                <form className="space-y-5" onSubmit={handleProfileSave}>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name
                    </label>

                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Email Address
                      </label>

                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                          type="email"
                          required
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              email: e.target.value,
                            })
                          }
                          placeholder="admin@example.com"
                          className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>

                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              phone: e.target.value,
                            })
                          }
                          placeholder="Enter phone number"
                          className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-gray-100 pt-5">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiSave />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Change Password */}

            <form
              onSubmit={handlePasswordChange}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-3"
            >
              <div className="mb-5 flex items-center gap-3">
                <FiLock className="text-blue-600" size={20} />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Change Password
                  </h2>
                  <p className="text-sm text-gray-500">
                    Update your administrator account password.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <input
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />

                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  required
                  className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />

                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                  className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiLock />
                  {changingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* System Settings */}
        {activeTab === "system" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-lg font-bold text-gray-900">
                Store Information
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Store Name
                  </label>

                  <input
                    type="text"
                    placeholder="Gebeya"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Store Logo URL
                  </label>

                  <input
                    type="text"
                    placeholder="Enter logo image URL"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Contact Email
                  </label>

                  <input
                    type="email"
                    placeholder="store@example.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Contact Phone
                  </label>

                  <input
                    type="tel"
                    placeholder="Enter store phone"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Store Address
                  </label>

                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-4 text-gray-400" />

                    <textarea
                      rows="3"
                      placeholder="Enter store address"
                      className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Currency
                  </label>

                  <select className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500">
                    <option value="USD">USD - US Dollar</option>
                    <option value="ETB">ETB - Ethiopian Birr</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end border-t border-gray-100 pt-5">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <FiSave />
                  Save Store Information
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900">
                <FiBell className="text-blue-600" />
                Notifications
              </h2>

              <div className="space-y-5">
                {[
                  {
                    title: "Email Notifications",
                    description:
                      "Receive important store notifications by email.",
                  },
                  {
                    title: "Order Notifications",
                    description:
                      "Get notified when customers place new orders.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-5 w-5 accent-blue-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <FiTool className="text-orange-500" />
                Maintenance Mode
              </h2>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    Enable Maintenance Mode
                  </h3>

                  <p className="text-sm text-gray-500">
                    Temporarily mark the store as under maintenance.
                  </p>
                </div>

                <input type="checkbox" className="h-5 w-5 accent-orange-500" />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Settings;
