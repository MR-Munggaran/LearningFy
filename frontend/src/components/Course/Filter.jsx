import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function Filter({ onSearch }) {
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  };

  return (
    <section className="w-full py-6 bg-[#F1F5F9] border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-[#2563EB]">
            <FaSearch className="h-5 w-5 text-gray-400" />
            <input
              id="search"
              type="text"
              placeholder=" Cari course berdasarkan judul..."
              value={search}
              onChange={handleChange}
              className="w-full bg-transparent text-base text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
