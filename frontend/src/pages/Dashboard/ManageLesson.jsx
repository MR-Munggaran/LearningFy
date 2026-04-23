import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLessons } from "../../hooks/useLessons";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageLesson() {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const { fetchLessons, deleteLesson, loading } = useLessons();

  useEffect(() => {
    const loadData = async () => {
      if (!moduleId) return;
      try {
        const lessonData = await fetchLessons(moduleId);
        setLessons(lessonData.lessons || []);
      } catch (err) {
        console.error("Failed to load lessons", err);
      }
    };
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    loadData();
  }, [moduleId]);

  const filteredLessons = useMemo(() => {
    return lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(filter.toLowerCase()) ||
        l.content?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, lessons]);

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const paginatedLessons = filteredLessons.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin hapus lesson ini?")) return;
    try {
      await deleteLesson(id);
      setLessons((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const getContentTypeBadge = (type) => {
    const styles = {
      text: "bg-blue-100 text-blue-800",
      video: "bg-red-100 text-red-800",
      pdf: "bg-orange-100 text-orange-800",
      quiz: "bg-purple-100 text-purple-800",
    };
    return styles[type] || "bg-gray-100 text-gray-800";
  };

  if (!moduleId) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-center text-gray-500">Module ID is required</p>
      </div>
    );
  }

  // ── Skeleton rows ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-7 w-48 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-9 w-28 rounded-lg bg-green-100 animate-pulse" />
        </div>
        <div className="h-10 w-full rounded-lg bg-gray-100 animate-pulse mb-4" />
        <div className="rounded-xl overflow-hidden border border-gray-200">
          <div className="bg-[#F1F5F9] h-11" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-4 py-3 border-t border-gray-100 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-gray-200" />
              <div className="flex-1 h-4 rounded-full bg-gray-100" />
              <div className="h-5 w-16 rounded-full bg-blue-100" />
              <div className="h-4 w-20 rounded-full bg-gray-100" />
              <div className="h-4 w-16 rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#2563EB]">📖 Manage Lessons</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {lessons.length} lesson di modul ini
          </p>
        </div>
        <button
          onClick={() =>
            navigate(`/dashboard/instructor/modules/${moduleId}/lessons/new`)
          }
          className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-emerald-600 transition font-semibold"
        >
          + Add Lesson
        </button>
      </div>

      {/* Filter */}
      <input
        type="text"
        placeholder="Filter by title atau konten..."
        className="mb-4 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2563EB] outline-none text-sm"
        value={filter}
        onChange={(e) => {
          setPage(1);
          setFilter(e.target.value);
        }}
      />

      {/* Table */}
      <div className="overflow-hidden rounded-xl shadow border border-gray-200">
        <table className="min-w-full bg-white text-gray-800">
          <thead className="bg-[#F1F5F9] text-[#2563EB]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Posisi</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Judul</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Tipe</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Resource</th>
              <th className="px-4 py-3 text-sm font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedLessons.length > 0 ? (
                paginatedLessons.map((lesson) => (
                  <motion.tr
                    key={lesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-[#F59E0B] text-white rounded-full text-sm font-medium">
                        {lesson.position}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-sm">{lesson.title}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getContentTypeBadge(lesson.content_type)}`}
                      >
                        {lesson.content_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {lesson.resource_url ? (
                        <a
                          href={lesson.resource_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#2563EB] hover:underline"
                        >
                          View Resource
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/instructor/modules/${moduleId}/lessons/${lesson.id}/edit`)
                          }
                          className="text-[#2563EB] hover:underline text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(lesson.id)}
                          className="text-red-500 hover:underline text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <svg
                        className="h-12 w-12 opacity-30"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"
                        />
                      </svg>
                      <p className="text-sm font-medium">
                        {filter
                          ? `Tidak ada lesson dengan kata kunci "${filter}"`
                          : "Belum ada lesson di modul ini"}
                      </p>
                      {!filter && (
                        <button
                          onClick={() =>
                            navigate(`/dashboard/instructor/modules/${moduleId}/lessons/new`)
                          }
                          className="text-[#2563EB] text-sm hover:underline"
                        >
                          + Tambah lesson pertama
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                page === i + 1 ? "bg-[#2563EB] text-white" : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}