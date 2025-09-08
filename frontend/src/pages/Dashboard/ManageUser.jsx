import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserModal from "../../components/Dashboard/UserModal";
import useProfile from "../../hooks/useProfile";
import toast from "react-hot-toast";

export default function ManageUsers() {
  const { listUser, updateUser, deleteUser, loading } = useProfile();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 7;

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };
    const fetchUsers = async () => {
      const data = await listUser();
      setUsers(data.users);
    };
    fetchUsers();
    scrollToTop();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const name = u.name?.toLowerCase() || "";
      const email = u.email?.toLowerCase() || "";
      const role = u.role?.toLowerCase() || "";
      const search = filter.toLowerCase();

      return name.includes(search) || email.includes(search) || role.includes(search);
    });
  }, [filter, users]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
      toast.success("✅ User deleted");
    } catch (err) {
      toast.error("❌ Failed to delete user");
    }
  };

  const handleSave = async (user) => {
    try {
      if (user.id) {
        const updated = await updateUser(user.id, user);
        setUsers(users.map((u) => (u.id === user.id ? updated : u)));
      } else {
        const created = await updateUser(null, user);
        setUsers([...users, created]);
      }
      toast.success("💾 User saved");
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error("❌ Failed to save user");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#2563EB]">👥 Manage Users</h2>
      </div>

      {/* Filter */}
      <input
        type="text"
        placeholder="🔍 Search by name, email, or role..."
        className="mb-6 w-full px-4 py-2 rounded-lg border border-[#2563EB]/30 
                   focus:outline-none focus:ring-2 focus:ring-[#2563EB] 
                   bg-white text-gray-800 shadow-sm"
        value={filter}
        onChange={(e) => {
          setPage(1);
          setFilter(e.target.value);
        }}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-xl shadow-lg ring-1 ring-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F1F5F9]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created At</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-3 text-center text-gray-500">Loading...</td>
              </tr>
            ) : paginatedUsers.length > 0 ? (
              <AnimatePresence>
                {paginatedUsers.map((user, idx) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-[#F1F5F9]/50 transition"
                  >
                    <td className="px-4 py-3 text-gray-800">{user.name}</td>
                    <td className="px-4 py-3 text-gray-800">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.role === "admin"
                            ? "bg-[#2563EB]/10 text-[#2563EB]"
                            : user.role === "instructor"
                            ? "bg-[#10B981]/10 text-[#10B981]"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.created_at}</td>
                    <td className="px-4 py-3 flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-sm hover:bg-[#1E40AF] transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-3 text-center text-gray-500">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages || 1}
        </p>
        <div className="flex gap-2">
          {/* Prev Button */}
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-[#F1F5F9] text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>

          {/* Numeric pages */}
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded-lg border ${
                p === page
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-[#F1F5F9] text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}

          {/* Next Button */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>


      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <UserModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSave}
              selectedUser={selectedUser}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
