import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { changeUserPassword } from "../../api/authService";
import type { ChangePasswordData } from "../../types";

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState<ChangePasswordData>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.old_password || !formData.new_password) {
      toast.error("Please fill in both fields.");
      return;
    }
    setLoading(true);
    try {
      const response = await changeUserPassword(formData);
      toast.success(response.message || "Password changed successfully!");
      navigate("/profile");
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to change password. Please try again.");
      }
      console.error("Change password failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-4 max-w-lg mx-auto">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          ← Back
        </button>
      </div>
      <div className="p-8 space-y-6 bg-white rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-center">Change Your Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Old Password
            </label>
            <input
              name="old_password"
              type="password"
              onChange={handleChange}
              className="input-field w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              name="new_password"
              type="password"
              onChange={handleChange}
              className="input-field w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 mt-1"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
