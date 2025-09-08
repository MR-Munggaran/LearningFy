import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import useTags from "../../hooks/useTags";

export default function ManageTags() {
  const { listTags, createTag, deleteTag, loading } = useTags();
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const tagsPerPage = 7;

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };
    const fetchTags = async () => {
      const res = await listTags();
      setTags(res.tags || []);
    };
    fetchTags();
    scrollToTop();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    const res = await createTag({ name: newTag });
    if (res) {
      setTags((prev) => [res, ...prev]);
      setNewTag("");
      setCurrentPage(1);
      toast.success("✅ Tag added");
    }
  };

  const handleDelete = async (id) => {
    const ok = await deleteTag(id);
    if (ok) {
      setTags((prev) => prev.filter((t) => t.id !== id));
      toast.success("🗑️ Tag deleted");
    }
  };

  const indexOfLastTag = currentPage * tagsPerPage;
  const indexOfFirstTag = indexOfLastTag - tagsPerPage;
  const currentTags = tags.slice(indexOfFirstTag, indexOfLastTag);
  const totalPages = Math.ceil(tags.length / tagsPerPage);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#2563EB]">🏷️ Manage Tags</h2>
      </div>

      {/* Form Add Tag */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter new tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-[#2563EB]/30 
                     focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white text-gray-800"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-[#2563EB] text-white hover:bg-[#1E40AF] transition"
        >
          {loading ? "Saving..." : "Add"}
        </button>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-xl shadow-lg ring-1 ring-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F1F5F9]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentTags.length > 0 ? (
              <AnimatePresence>
                {currentTags.map((tag, idx) => (
                  <motion.tr
                    key={tag.id ?? idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-[#F1F5F9]/50 transition"
                  >
                    <td className="px-4 py-3 text-gray-800">{indexOfFirstTag + idx + 1}</td>
                    <td className="px-4 py-3 text-gray-800">{tag.name}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(tag.id)}
                        className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500 italic">
                  No tags available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {tags.length > tagsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-[#F1F5F9] text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-3 py-1 rounded-lg border ${
                currentPage === p
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-[#F1F5F9] text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
