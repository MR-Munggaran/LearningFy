import React from "react";
import { getImageUrl } from "../getImageUrl";
import { Link } from "react-router-dom";

function SimilarCourseSkeleton() {
  return (
    <div className="rounded-lg p-4 animate-pulse">
      <div className="h-40 w-full rounded-md bg-gray-200" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 rounded-full bg-gray-200" />
        <div className="h-4 w-1/3 rounded-full bg-gray-100" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-3 flex flex-col items-center gap-3 py-12 text-gray-400">
      <svg
        className="h-12 w-12 opacity-30"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-sm font-medium">Tidak ada kursus serupa ditemukan</p>
    </div>
  );
}

const SimilarCourse = ({ similarCourses, loading }) => {
  return (
    <div className="mx-auto max-w-7xl px-4 mt-16">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Courses</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SimilarCourseSkeleton key={i} />)
        ) : !similarCourses || similarCourses.length === 0 ? (
          <EmptyState />
        ) : (
          similarCourses.map((sc) => (
            <div
              key={sc.id}
              className="rounded-lg p-4 hover:shadow-xl transition"
            >
              <Link to={`/course/${sc.id}`}>
                <img
                  src={getImageUrl(sc.image)}
                  alt={sc.title}
                  className="h-40 w-full object-cover rounded-md"
                />
              </Link>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {sc.title}
              </h3>
              <p className="text-gray-600">
                {sc.price ? `Rp ${sc.price.toLocaleString("id-ID")}` : "Free"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SimilarCourse;