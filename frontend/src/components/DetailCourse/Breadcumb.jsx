// Breadcumb.jsx
import React from "react";

const Breadcumb = ({ course, loading }) => {
  if (loading || !course) {
    return (
      <nav aria-label="Breadcrumb">
        <ol className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8 animate-pulse">
          <li className="flex items-center gap-2">
            <div className="h-3 w-20 rounded-full bg-gray-200" />
            <svg
              fill="currentColor"
              width={16}
              height={20}
              viewBox="0 0 16 20"
              className="h-5 w-4 text-gray-200"
            >
              <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
            </svg>
          </li>
          <li>
            <div className="h-3 w-32 rounded-full bg-gray-200" />
          </li>
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb">
      <ol className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <li key={course.id}>
          <div className="flex items-center">
            <p className="mr-2 text-sm font-medium text-gray-900">
              {course.category_name}
            </p>
            <svg
              fill="currentColor"
              width={16}
              height={20}
              viewBox="0 0 16 20"
              aria-hidden="true"
              className="h-5 w-4 text-gray-300"
            >
              <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
            </svg>
          </div>
        </li>
        <li className="text-sm">
          <span className="font-medium text-gray-500 hover:text-gray-600">
            {course.title}
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcumb;