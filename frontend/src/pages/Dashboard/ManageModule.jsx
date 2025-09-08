import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useModules } from "../../hooks/useModules";
import { useCourses } from "../../hooks/useCourses";
import ModuleModal from "../../components/Dashboard/ModuleModal";
import ManageLesson from "./ManageLesson";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageModule() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  
  const [modules, setModules] = useState([]);
  const [courseData, setCourseData] = useState(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [view, setView] = useState("modules");
  const [activeModuleId, setActiveModuleId] = useState(null);

  const itemsPerPage = 7;

  // Hooks
  const { fetchModules, createModule, updateModule, deleteModule, loading } = useModules();
  const { fetchCourseDetail } = useCourses();

  // Load course data dan modules
  useEffect(() => {
    const loadData = async () => {
      if (!courseId) return;

      try {
        // Load course data
        const course = await fetchCourseDetail(courseId);
        setCourseData(course.course);

        // Load modules for this course
        const moduleData = await fetchModules(courseId);
        setModules(moduleData.modules || []);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    loadData();
    scrollToTop();
  }, [courseId]);

  // Filter modules
  const filteredModules = useMemo(() => {
    return modules.filter((m) =>
      m.title?.toLowerCase().includes(filter.toLowerCase()) ||
      m.description?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, modules]);

  const totalPages = Math.ceil(filteredModules.length / itemsPerPage);
  const paginatedModules = filteredModules.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Handle delete module
  const handleDelete = async (id) => {
    try {
      await deleteModule(id);
      setModules((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // Handle save module (create/update)
  const handleSave = async (moduleData) => {
    const dataWithCourse = { ...moduleData, courseId }; // tambahkan courseId dari context
    if (selectedModule) {
      const updatedModule = await updateModule(selectedModule.id, dataWithCourse);
      setModules((prev) =>
        prev.map((m) => (m.id === selectedModule.id ? updatedModule : m))
      );
    } else {
      const newModule = await createModule(courseId, dataWithCourse);
      setModules((prev) => [...prev, newModule]);
    }
    setIsModalOpen(false);
    setSelectedModule(null);
  };


  // Handle back to manage courses
  const handleBackToCourses = () => {
    navigate("/dashboard/instructor/courses");
  };

  // Jika sedang view lessons
  if (view === "lessons") {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => {
            setView("modules");
            setActiveModuleId(null);
          }}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          ⬅ Back to Modules
        </button>
        <ManageLesson moduleId={activeModuleId} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBackToCourses}
            className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            ⬅ Back to Courses
          </button>
          <div>
            <h2 className="text-2xl font-bold text-[#2563EB]">📘 Manage Modules</h2>
            {courseData && (
              <p className="text-gray-600 text-sm">
                Course: <span className="font-medium">{courseData.title}</span>
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={() => {
            setSelectedModule(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-emerald-600 transition"
        >
          + Add Module
        </button>
      </div>

      {/* Filter */}
      <input
        type="text"
        placeholder="Filter by title or description..."
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
              <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
              <th className="px-4 py-3 text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-center text-gray-400">
                    Loading modules...
                  </td>
                </tr>
              ) : paginatedModules.length > 0 ? (
                paginatedModules.map((module) => (
                  <motion.tr
                    key={module.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-200"
                  >
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-[#2563EB] text-white rounded-full text-sm font-medium">
                        {module.position}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{module.title}</td>
                    <td className="px-4 py-3">
                      {module.description.length > 60
                        ? module.description.substring(0, 60) + "..."
                        : module.description}
                    </td>
                    <td className="px-4 py-3 flex gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedModule(module);
                          setIsModalOpen(true);
                        }}
                        className="text-[#2563EB] hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setActiveModuleId(module.id);
                          setView("lessons");
                        }}
                        className="text-[#F59E0B] hover:underline text-sm"
                      >
                        Lessons
                      </button>
                      <button
                        className="text-red-500 hover:underline text-sm"
                        onClick={() => handleDelete(module.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-center text-gray-400">
                    No modules found for this course
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

      {/* Module Modal */}
      <ModuleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedModule(null);
        }}
        onSave={handleSave}
        selectedModule={selectedModule}
      />
    </div>
  );
}