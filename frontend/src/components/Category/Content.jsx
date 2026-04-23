import React, { useEffect, useState } from "react";
import { useCourses } from "../../hooks/useCourses";
import useCategory from "../../hooks/useCategory";
import { Link } from "react-router-dom";
import { getImageUrl } from "../getImageUrl";

function CategorySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse p-4 rounded-lg bg-gray-100 border border-gray-100"
        >
          <div className="h-4 w-1/2 rounded-full bg-gray-300 mb-2" />
          <div className="h-3 w-1/4 rounded-full bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

function CourseCardSkeleton() {
  return (
    <div className="flex flex-col md:flex-row bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="md:w-2/5 h-48 bg-gray-200" />
      <div className="p-6 flex flex-col gap-3 flex-grow">
        <div className="h-5 w-3/4 rounded-full bg-gray-200" />
        <div className="h-4 w-1/3 rounded-full bg-gray-200" />
        <div className="h-3 w-full rounded-full bg-gray-100" />
        <div className="h-3 w-2/3 rounded-full bg-gray-100" />
        <div className="mt-auto flex justify-between items-center">
          <div className="h-5 w-20 rounded-full bg-blue-100" />
          <div className="h-9 w-24 rounded-lg bg-blue-200" />
        </div>
      </div>
    </div>
  );
}

function EmptyCourses({ categoryName }) {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-gray-400">
      <svg
        className="h-14 w-14 opacity-30"
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
        Belum ada kursus untuk kategori{" "}
        <span className="text-blue-500">{categoryName}</span>
      </p>
    </div>
  );
}

const Content = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);

  const { fetchCourses, loading } = useCourses();
  const { categoryList, loading: loadingCategories } = useCategory();

  useEffect(() => {
    const loadData = async () => {
      try {
        const dataCourses = await fetchCourses();
        setCourses(dataCourses.courses || []);

        const dataCategories = await categoryList();
        setCategories(dataCategories.category || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    loadData();
  }, []);

  const filteredCourses = selectedCategory
    ? courses.filter((c) => c.category_name === selectedCategory.name)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Kategori Bahasa Pemrograman
      </h2>
      <p className="text-gray-600 mb-8">
        Pilih kategori untuk melihat kursus yang tersedia
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Categories */}
        <div className="w-full lg:w-4/12">
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Semua Kategori
            </h3>

            {loadingCategories || loading ? (
              <CategorySkeleton />
            ) : categories.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                Belum ada kategori tersedia
              </p>
            ) : (
              <div className="space-y-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat)}
                    className={`cursor-pointer p-4 rounded-lg transition ${
                      selectedCategory?.id === cat.id
                        ? "bg-blue-100 border border-blue-200"
                        : "bg-white border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <h4 className="font-medium text-gray-900">{cat.name}</h4>
                    <p className="text-xs text-gray-500">
                      {courses.filter((c) => c.category_name === cat.name).length} kursus
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Courses */}
        <div className="w-full lg:w-8/12">
          {/* Belum pilih kategori */}
          {!selectedCategory && !loading && (
            <div className="flex flex-col items-center gap-3 py-24 text-gray-400">
              <svg
                className="h-14 w-14 opacity-30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"
                />
              </svg>
              <p className="text-sm font-medium">
                Pilih kategori untuk melihat kursus
              </p>
            </div>
          )}

          {/* Skeleton kursus saat loading */}
          {loading && selectedCategory && (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Data kursus */}
          {!loading && selectedCategory && (
            <>
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Kursus {selectedCategory.name}
                <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {filteredCourses.length} kursus
                </span>
              </h3>

              {filteredCourses.length === 0 ? (
                <EmptyCourses categoryName={selectedCategory.name} />
              ) : (
                <div className="space-y-6">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                    >
                      <div className="md:w-2/5">
                        <img
                          src={getImageUrl(course.image)}
                          alt={course.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="p-6 flex flex-col justify-between flex-grow">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {course.title}
                          </h3>
                          <p className="text-gray-600 mt-2">
                            Pengajar: {course.instructor_name}
                          </p>
                          <p className="text-gray-500 text-sm mt-4 line-clamp-2">
                            {course.description.length > 50
                              ? course.description.substring(0, 50) + "..."
                              : course.description}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-6">
                          <p className="text-lg font-semibold text-blue-700">
                            Rp {course.price}
                          </p>
                          <Link
                            to={`/course/${course.id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                          >
                            Lihat Detail
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Content;