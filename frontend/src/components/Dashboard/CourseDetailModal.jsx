import React from "react";
import { getImageUrl } from "../getImageUrl";
import { IoMdClose } from "react-icons/io";

export default function CourseDetailModal({ isOpen, onClose, course }) {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 transition"
        >
          <IoMdClose className="w-5 h-5 text-gray-600" />
        </button>

        {/* Image */}
        <img
          src={getImageUrl(course.image)}
          alt={course.title}
          className="h-48 w-full object-cover"
        />

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            📖 {course.title}
          </h2>

          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-semibold text-gray-900">Kategori:</span>{" "}
              {course.category_name}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Pengajar:</span>{" "}
              {course.instructor_name}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Harga:</span>{" "}
              <span className="text-indigo-600 font-semibold">
                Rp {Number(course.price).toLocaleString()}
              </span>
            </p>
            <div>
              <span className="font-semibold text-gray-900">Deskripsi:</span>
              <p className="mt-1 text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {course.description}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-indigo-600 text-white font-medium rounded-xl shadow hover:bg-indigo-700 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
