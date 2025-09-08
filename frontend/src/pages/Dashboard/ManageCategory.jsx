import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import CategoryModal from "../../components/Dashboard/CategoryModal";
import useCategory from "../../hooks/useCategory";

export default function ManageCategory() {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [localCategories, setLocalCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 7;

  const { categoryList, createCategory, updateCategory, deleteCategory, loading } =
    useCategory();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };
    const fetchCategory = async () => {
      const data = await categoryList();
      setLocalCategories(data.category || []);
    };
    fetchCategory();
    scrollToTop();
  }, []);

  const filteredCategories = useMemo(() => {
    return localCategories.filter(
      (c) =>
        c.name?.toLowerCase().includes(filter.toLowerCase()) ||
        c.description?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, localCategories]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSave = async (cat) => {
    try {
      if (cat.id) {
        const updated = await updateCategory(cat.id, cat);
        if (updated) {
          setLocalCategories((prev) =>
            prev.map((c) => (c.id === cat.id ? updated : c))
          );
        }
      } else {
        const created = await createCategory(cat);
        if (created) {
          setLocalCategories((prev) => [created, ...prev]);
          setPage(1);
        }
      }
      toast.success("✅ Category saved");
      setIsModalOpen(false);
      setSelectedCategory(null);
    } catch {
      toast.error("❌ Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    const ok = await deleteCategory(id);
    if (ok) {
      setLocalCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("🗑️ Category deleted");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#2563EB]">📂 Manage Categories</h2>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] transition"
        >
          + Add Category
        </button>
      </div>

      {/* Filter */}
      <input
        type="text"
        placeholder="🔍 Filter by name or description..."
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Description
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="3" className="px-4 py-3 text-center text-gray-500">Loading...</td>
              </tr>
            ) : paginatedCategories.length > 0 ? (
              <AnimatePresence>
                {paginatedCategories.map((cat, idx) => (
                  <motion.tr
                    key={cat.id ?? `cat-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-[#F1F5F9]/50 transition"
                  >
                    <td className="px-4 py-3 text-gray-800">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-800">{cat.description}</td>
                    <td className="px-4 py-3 flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-lg bg-[#2563EB] text-white text-sm hover:bg-[#1E40AF] transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
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
                <td colSpan="3" className="px-4 py-3 text-center text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-600">Page {page} of {totalPages || 1}</p>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-[#F1F5F9] text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>

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
            <CategoryModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleSave}
              selectedCategory={selectedCategory}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
