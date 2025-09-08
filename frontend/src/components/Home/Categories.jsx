import { FaCode, FaPalette, FaBriefcase, FaBookOpen, FaBrain } from "react-icons/fa";
import useCategory from "../../hooks/useCategory";
import { useEffect, useState } from "react";

const iconMap = {
  Python: <FaCode className="h-10 w-10 text-blue-600" />,
  JavaScript: <FaPalette className="h-10 w-10 text-purple-600" />,
  "PHP/Laravel": <FaBriefcase className="h-10 w-10 text-emerald-500" />,
  Java: <FaBrain className="h-10 w-10 text-orange-500" />,
  "React Native": <FaBookOpen className="h-10 w-10 text-gray-700" />,
};

export default function Categories() {
  const [category, setCategory] = useState([]);
  const {categoryList, loading} = useCategory(); // asumsi hook return [data, loading]

 useEffect(() => {
  const loadCategory = async () => {
    try {
      const data = await categoryList();
      setCategory(data.category || []);
    } catch (err) {
      console.error("Failed to fetch category", err);
    }
  };
  loadCategory();
}, []);

  // tampilkan hanya 5
  const topCategories = category.slice(0, 5);

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
          Explore Categories
        </h2>

        {loading ? (
          <p className="text-center mt-6 text-gray-500">Loading categories...</p>
        ) : (
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-y-10 gap-x-8 sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            {topCategories.map((cat, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl shadow-sm hover:shadow-md transition bg-gray-50 hover:bg-blue-50"
              >
                {/* pilih icon sesuai nama kategori */}
                {iconMap[cat.name] || (
                  <FaBookOpen className="h-10 w-10 text-gray-500" />
                )}
                <span className="text-sm font-medium text-gray-800">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
