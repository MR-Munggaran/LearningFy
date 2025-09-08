import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import useProfile from "../hooks/useProfile";
import UpdateUserModal from "../components/Dashboard/UpdateUserModal";

export default function Profile() {
  const { profileMe, loading } = useProfile();
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUser = async () => {
    const res = await profileMe();
    if (res) setUser(res.user);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSave = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-500">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-0 m-[4rem]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h3 className="text-2xl font-bold text-[#2563EB]">Your Profile</h3>
        <p className="mt-2 text-sm text-gray-500">
          Personal details and user information.
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white rounded-2xl shadow-lg border border-[#F1F5F9] p-6 max-w-2xl mx-auto"
      >
        <dl className="divide-y divide-[#F1F5F9]">
          <div className="py-4 grid grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-[#2563EB]">Name</dt>
            <dd className="col-span-2 text-gray-700">{user.name}</dd>
          </div>

          <div className="py-4 grid grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-[#2563EB]">Email</dt>
            <dd className="col-span-2 text-gray-700">{user.email}</dd>
          </div>

          <div className="py-4 grid grid-cols-3 gap-4">
            <dt className="text-sm font-medium text-[#2563EB]">Role</dt>
            <dd className="col-span-2 text-gray-700">{user.role}</dd>
          </div>
        </dl>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-gradient-to-r from-[#2563EB] to-[#10B981] px-5 py-2 font-medium text-white shadow-md hover:opacity-90 transition"
          >
            Update Profile
          </button>
        </div>
      </motion.div>

      {/* Modal */}
      <UpdateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onSave={handleSave}
      />
    </div>
  );
}
