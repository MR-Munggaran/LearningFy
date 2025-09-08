import { Link } from "react-router-dom";
import { useCourses } from "../../hooks/useCourses";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Filter from "./Filter";
import { getImageUrl } from "../getImageUrl";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  const { fetchCourses, loading } = useCourses();

  const scrollToTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data.courses || []);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };
    loadCourses();
  }, []);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLast = currentPage * coursesPerPage;
  const indexOfFirst = indexOfLast - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirst, indexOfLast);

  // Variants untuk animasi
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="bg-[#F1F5F9]" id="courseall">
      {/* Filter */}
      <Filter
        onSearch={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-[#2563EB]">
          Semua Courses
        </h2>

        {loading ? (
          <p className="mt-6 text-gray-600 text-lg">Loading courses...</p>
        ) : (
          <>
            {/* Grid List with Animation */}
            <motion.div
              className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key={currentPage} // penting agar animasi trigger setiap ganti page
            >
              {currentCourses.map((course) => (
                <motion.div
                  key={course.id}
                  className="group relative rounded-2xl bg-white p-5 shadow-md hover:shadow-xl transition"
                  variants={cardVariants}
                >
                  <img
                    alt={course.imageAlt || course.title}
                    src={getImageUrl(course.image)}
                    className="aspect-square w-full rounded-lg object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="mt-4 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#2563EB]">
                      {course.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium text-[#10B981]">
                        {course.instructor_name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#F1F5F9] text-gray-600 text-xs">
                        {course.category_name}
                      </span>
                    </div>

                    <p className="text-lg font-bold text-[#2563EB]">
                      {course.price ? `Rp${(course.price.toLocaleString("id-ID"))}` : "Free"}
                    </p>

                    <Link
                      to={`/course/${course.id}`}
                      className="mt-3 inline-block w-full rounded-lg bg-[#2563EB] px-4 py-2 text-center text-white font-semibold shadow hover:bg-[#1E40AF] transition"
                      onClick={scrollToTop()}
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="px-4 py-2 rounded-lg bg-white text-gray-600 shadow hover:bg-[#F1F5F9] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg font-medium shadow ${
                      currentPage === i + 1
                        ? "bg-[#2563EB] text-white"
                        : "bg-white text-gray-600 hover:bg-[#F1F5F9]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="px-4 py-2 rounded-lg bg-white text-gray-600 shadow hover:bg-[#F1F5F9] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
