import React, { useEffect, useState } from "react";
import { useCourses } from "../../hooks/useCourses";
import useCategory from "../../hooks/useCategory";
import { Link } from "react-router-dom";
import { getImageUrl } from "../getImageUrl";

const Content = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);

  const { fetchCourses, loading } = useCourses();
  const { categoryList } = useCategory();

  // Ambil data
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

  // Filter courses by category
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
                    {
                      courses.filter((c) => c.category_name === cat.name).length
                    }{" "}
                    kursus
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Courses */}
        <div className="w-full lg:w-8/12">
          {loading || !selectedCategory ? (
            <p className="text-gray-500">Pilih kategori untuk melihat kursus</p>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Kursus {selectedCategory.name}
                <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {filteredCourses.length} kursus
                </span>
              </h3>

              <div className="space-y-6">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                  >
                    {/* Image */}
                    <div className="md:w-2/5">
                      <img
                        src={getImageUrl(course.image)}
                        alt={course.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    {/* Details */}
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
                        <Link to={`/course/${course.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                          Lihat Detail
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Content;
