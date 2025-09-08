import { useState, useMemo, useEffect } from "react";
import { useCourses } from "../../hooks/useCourses";
import CourseDetailModal from "../../components/Dashboard/CourseDetailModal";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEdit, FaLayerGroup, FaTrash   } from "react-icons/fa";

export default function ManageCourse() {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailCourse, setDetailCourse] = useState(null);
  const itemsPerPage = 7;
  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  const { fetchCourses, deleteCourse, loading } = useCourses();

  // Ambil data dari API
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses({ instructor: authUser.user.name });
        setCourses(data.courses || []);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };
    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };
    scrollToTop();
    loadCourses();
  }, []);

  // Filter
  const filteredCourses = useMemo(() => {
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(filter.toLowerCase()) ||
        c.category_name?.toLowerCase().includes(filter.toLowerCase()) ||
        c.instructor_name?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, courses]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleDelete = async (id) => {
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // Fungsi untuk navigasi ke manage module
  const handleManageModules = (courseId) => {
    navigate(`/dashboard/instructor/modules/${courseId}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#2563EB]">📚 Manage Courses</h2>
        <button
          onClick={() => navigate("new")}
          className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-emerald-600 transition"
        >
          + Add Course
        </button>
      </div>

      {/* Filter */}
      <input
        type="text"
        placeholder="Filter by title, category, teacher..."
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
              <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Instructor</th>
              <th className="px-12 py-3 text-sm font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-3 text-center text-gray-400">
                    Loading courses...
                  </td>
                </tr>
              ) : paginatedCourses.length > 0 ? (
                paginatedCourses.map((course) => (
                  <motion.tr
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-200"
                  >
                    <td className="px-4 py-3">{course.title}</td>
                    <td className="px-4 py-3">
                      {course.description.length > 50
                        ? course.description.substring(0, 50) + "..."
                        : course.description}
                    </td>
                    <td className="px-4 py-3">{course.category_name}</td>
                    <td className="px-4 py-3">
                      Rp {Number(course.price).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{course.instructor_name}</td>
                    <td className="px-4 py-3 flex gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setDetailCourse(course);
                          setIsDetailOpen(true);
                        }}
                        className="text-[#10B981] hover:text-green-700 text-lg"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => navigate(`${course.id}/edit`)}
                        className="text-[#2563EB] hover:text-blue-700 text-lg"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleManageModules(course.id)}
                        className="text-[#F59E0B] hover:text-yellow-600 text-lg"
                        title="Modules"
                      >
                        <FaLayerGroup />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="text-red-500 hover:text-red-700 text-lg"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-3 text-center text-gray-400">
                    No courses found
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

      {/* Detail Modal */}
      <CourseDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        course={detailCourse}
      />
    </div>
  );
}