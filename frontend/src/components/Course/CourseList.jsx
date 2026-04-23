import { Link } from "react-router-dom";
import { useCourses } from "../../hooks/useCourses";
import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Filter from "./Filter";
import { getImageUrl } from "../getImageUrl";

function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-md animate-pulse">
      {/* Thumbnail */}
      <div className="aspect-square w-full rounded-lg bg-gray-200" />
      <div className="mt-4 space-y-3">
        {/* Title */}
        <div className="h-4 w-3/4 rounded-full bg-gray-200" />
        {/* Instructor + Badge */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-24 rounded-full bg-green-100" />
          <div className="h-3 w-16 rounded-full bg-gray-200" />
        </div>
        {/* Price */}
        <div className="h-5 w-20 rounded-full bg-blue-100" />
        {/* Button */}
        <div className="h-9 w-full rounded-lg bg-blue-200" />
      </div>
    </div>
  );
}

function EmptyState({ searchTerm }) {
  return (
    <div className="col-span-full flex flex-col items-center gap-4 py-24 text-gray-400">
      <svg
        className="h-16 w-16 opacity-30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
      {searchTerm ? (
        <>
          <p className="text-base font-medium">
            Tidak ada course untuk{" "}
            <span className="text-blue-500">"{searchTerm}"</span>
          </p>
          <p className="text-sm">Coba kata kunci yang berbeda ya 🙁</p>
        </>
      ) : (
        <>
          <p className="text-base font-medium">Belum ada course tersedia</p>
          <p className="text-sm">Cek lagi nanti ya 👀</p>
        </>
      )}
    </div>
  );
}

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 8;

  const { fetchCourses, loading } = useCourses();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="bg-[#F1F5F9]" id="courseall">
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

        {/* Skeleton */}
        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <motion.div
              className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key={currentPage}
            >
              {currentCourses.length === 0 ? (
                <EmptyState searchTerm={searchTerm} />
              ) : (
                currentCourses.map((course) => (
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
                        {course.price
                          ? `Rp${course.price.toLocaleString("id-ID")}`
                          : "Free"}
                      </p>
                      <Link
                        to={`/course/${course.id}`}
                        className="mt-3 inline-block w-full rounded-lg bg-[#2563EB] px-4 py-2 text-center text-white font-semibold shadow hover:bg-[#1E40AF] transition"
                        onClick={scrollToTop}
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>

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