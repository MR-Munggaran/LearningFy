import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserModal({ isOpen, onClose, onSave, selectedUser }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
  });

  useEffect(() => {
    setFormData({
      name: selectedUser?.name || "",
      email: selectedUser?.email || "",
      role: selectedUser?.role || "User",
    });
  }, [selectedUser]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[#FFFFFF] text-gray-800 p-6 rounded-2xl w-96 shadow-xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-[#2563EB]">
            {selectedUser ? "Edit User" : "Add User"}
          </h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              className="px-4 py-2 rounded-lg border border-[#2563EB]/50 focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 rounded-lg border border-[#2563EB]/50 focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="px-4 py-2 rounded-lg border border-[#2563EB]/50 focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            >
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#F1F5F9] text-gray-800 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave({ ...selectedUser, ...formData })}
              className="px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1E40AF] transition"
            >
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
