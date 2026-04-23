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

function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-gray-100 animate-pulse">
      {/* Icon placeholder */}
      <div className="h-10 w-10 rounded-full bg-gray-300" />
      {/* Label placeholder */}
      <div className="h-3 w-20 rounded-full bg-gray-300" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center gap-3 py-12 text-gray-400">
      <FaBookOpen className="h-10 w-10 opacity-40" />
      <p className="text-sm font-medium">Belum ada kategori tersedia</p>
    </div>
  );
}

export default function Categories() {
  const [category, setCategory] = useState([]);
  const { categoryList, loading } = useCategory();

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

  const topCategories = category.slice(0, 5);

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
          Explore Categories
        </h2>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-y-10 gap-x-8 sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {loading ? (
            // Skeleton: tampilkan 5 placeholder
            Array.from({ length: 5 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))
          ) : topCategories.length === 0 ? (
            // Empty state
            <EmptyState />
          ) : (
            topCategories.map((cat, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl shadow-sm hover:shadow-md transition bg-gray-50 hover:bg-blue-50"
              >
                {iconMap[cat.name] || (
                  <FaBookOpen className="h-10 w-10 text-gray-500" />
                )}
                <span className="text-sm font-medium text-gray-800">
                  {cat.name}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}