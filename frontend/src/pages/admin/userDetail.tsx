import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import api from "@/utils/axios";
import { toast } from "react-toastify";
import { Switch } from "@headlessui/react";
import Layout from "@/components/Layouts/Layout";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  profilePicture: string;
  bio: string;
  isVerified: boolean;
  isActive: boolean;
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data.user);
      } catch (err) {
        toast.error("Failed to load user data");
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!user) return;
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleToggle = (field: "isVerified" | "isActive") => {
    if (!user) return;
    setUser({ ...user, [field]: !user[field] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await api.put(`/users/${id}`, user);
      toast.success("User updated successfully");
      navigate("/admin/users");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading user...</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 p-8">
        <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-gray-200">
          {/* Header */}
          <div className="flex items-center gap-6 mb-8">
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                Edit User
              </h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Picture */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profile Picture URL
                </label>
                <input
                  type="text"
                  name="profilePicture"
                  value={user.profilePicture}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={user.bio}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                rows={3}
                placeholder="Write a short bio..."
              />
            </div>

            {/* Toggles */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
              <div className="flex items-center gap-3">
                <Switch
                  checked={user.isVerified}
                  onChange={() => handleToggle("isVerified")}
                  className={`${user.isVerified ? "bg-green-500" : "bg-gray-300"
                    } relative inline-flex h-7 w-14 items-center rounded-full transition-colors`}
                >
                  <span
                    className={`${user.isVerified ? "translate-x-8" : "translate-x-1"
                      } inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition`}
                  />
                </Switch>
                <span className="text-sm font-medium">Verified</span>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={user.isActive}
                  onChange={() => handleToggle("isActive")}
                  className={`${user.isActive ? "bg-green-500" : "bg-gray-300"
                    } relative inline-flex h-7 w-14 items-center rounded-full transition-colors`}
                >
                  <span
                    className={`${user.isActive ? "translate-x-8" : "translate-x-1"
                      } inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition`}
                  />
                </Switch>
                <span className="text-sm font-medium">Active</span>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                {loading ? "Updating..." : "Update User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UserDetail;
