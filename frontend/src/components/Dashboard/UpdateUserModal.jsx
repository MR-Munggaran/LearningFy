import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import useProfile from "../../hooks/useProfile";
import { useAuthContext } from "../../context/AuthContext";

export default function UpdateUserModal({ isOpen, onClose, user, onSave }) {
  const { authUser } = useAuthContext();
  const userid = authUser?.user?.id;
  const { updateUser } = useProfile(userid);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak sama!");
      return;
    }

    const result = await updateUser(user?.id, {
      name: formData.name,
      email: formData.email,
      password: formData.password || undefined,
    });

    if (result) {
      toast.success("User updated successfully");

      if (onSave) onSave(result.user);

      onClose();
      setFormData({
        name: result.user?.name || "",
        email: result.user?.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h2
              className="text-2xl font-semibold mb-6 text-[#2563EB]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              ✨ Update User
            </motion.h2>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {["name", "email", "password", "confirmPassword"].map(
                (field, index) => (
                  <motion.input
                    key={field}
                    type={field.includes("password") ? "password" : field}
                    name={field}
                    placeholder={
                      field === "name"
                        ? "Nama"
                        : field === "email"
                        ? "Email"
                        : field === "password"
                        ? "Password baru (opsional)"
                        : "Konfirmasi Password"
                    }
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-[#F1F5F9]"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 },
                    }}
                  />
                )
              )}

              <motion.div
                className="flex justify-end space-x-2 pt-2"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#10B981] text-white hover:bg-[#059669] shadow-md"
                >
                  Simpan
                </button>
              </motion.div>
            </motion.form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
