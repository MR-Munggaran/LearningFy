import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLessons } from "../../hooks/useLessons";
import { useModules } from "../../hooks/useModules";
import LessonModal from "../../components/Dashboard/LessonModal";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageLesson({ moduleId: propModuleId }) {
  // Ambil moduleId dari props atau URL params
  const { moduleId: urlModuleId } = useParams();
  const moduleId = propModuleId || urlModuleId;

  const [lessons, setLessons] = useState([]);
  const [moduleData, setModuleData] = useState(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  const itemsPerPage = 5;

  // Hooks
  const { fetchLessons, createLesson, updateLesson, deleteLesson, loading } = useLessons();

  // Load module data dan lessons
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
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };
    scrollToTop();
    loadData();
  }, [moduleId]);

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter((l) =>
      l.title.toLowerCase().includes(filter.toLowerCase()) ||
      l.content.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, lessons]);

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const paginatedLessons = filteredLessons.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Handle delete lesson
  const handleDelete = async (id) => {
    try {
      await deleteLesson(id);
      setLessons((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // Handle save lesson (create/update)
  const handleSave = async (lessonData) => {
    try {
      if (selectedLesson) {
        // Update existing lesson
        const updatedLesson = await updateLesson(selectedLesson.id, lessonData);
        setLessons((prev) =>
          prev.map((l) => (l.id === selectedLesson.id ? updatedLesson : l))
        );
      } else {
        // Create new lesson
        const newLesson = await createLesson(moduleId, lessonData);
        setLessons((prev) => [...prev, newLesson]);
      }
      setIsModalOpen(false);
      setSelectedLesson(null);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  // Content type badge styling
  const getContentTypeBadge = (type) => {
    const styles = {
      text: "bg-blue-100 text-blue-800",
      video: "bg-red-100 text-red-800",
      file: "bg-green-100 text-green-800",
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#2563EB]">📖 Manage Lessons</h2>
          {/* {moduleData && (
            <p className="text-gray-600 text-sm">
              Module: <span className="font-medium">{moduleData.title}</span>
            </p>
          )} */}
        </div>
        
        <button
          onClick={() => {
            setSelectedLesson(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-emerald-600 transition"
        >
          + Add Lesson
        </button>
      </div>

      {/* Filter */}
      <input
        type="text"
        placeholder="Filter by title or content..."
        className="mb-4 w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2563EB] outline-none"
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
              <th className="px-4 py-3 text-left text-sm font-semibold">Position</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Content Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Resource</th>
              <th className="px-4 py-3 text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-gray-400">
                    Loading lessons...
                  </td>
                </tr>
              ) : paginatedLessons.length > 0 ? (
                paginatedLessons.map((lesson) => (
                  <motion.tr
                    key={lesson.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-200"
                  >
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-[#F59E0B] text-white rounded-full text-sm font-medium">
                        {lesson.position}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{lesson.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getContentTypeBadge(lesson.content_type)}`}>
                        {lesson.content_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {lesson.resource_url ? (
                        <a
                          href={lesson.resource_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#2563EB] hover:underline text-sm"
                        >
                          View Resource
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 flex gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedLesson(lesson);
                          setIsModalOpen(true);
                        }}
                        className="text-[#2563EB] hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline text-sm"
                        onClick={() => handleDelete(lesson.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-gray-400">
                    No lessons found for this module
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

      {/* Lesson Modal */}
      <LessonModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLesson(null);
        }}
        onSave={handleSave}
        selectedLesson={selectedLesson}
        moduleId={moduleId}
      />
    </div>
  );
}