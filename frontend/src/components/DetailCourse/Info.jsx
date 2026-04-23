import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEnrollment } from "../../hooks/useEnrollment";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function InfoSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24 animate-pulse">
      {/* Left: Title + Description */}
      <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8 space-y-4">
        <div className="h-8 w-3/4 rounded-full bg-gray-200" />
        <div className="h-4 w-full rounded-full bg-gray-100" />
        <div className="h-4 w-5/6 rounded-full bg-gray-100" />
        <div className="h-4 w-2/3 rounded-full bg-gray-100" />
      </div>

      {/* Right: Price + Button */}
      <div className="mt-4 lg:row-span-3 lg:mt-0 space-y-6">
        <div className="h-9 w-32 rounded-full bg-gray-200" />
        {/* Stars */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-5 w-5 rounded-full bg-gray-200" />
          ))}
        </div>
        {/* Enroll button */}
        <div className="h-12 w-full rounded-md bg-indigo-100" />
      </div>

      {/* Bottom: Instructor + Modules + Tags */}
      <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pr-8 space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-20 rounded-full bg-gray-200" />
          <div className="h-3 w-32 rounded-full bg-gray-100" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-20 rounded-full bg-gray-200" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-3 w-2/3 rounded-full bg-gray-100" />
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-4 w-12 rounded-full bg-gray-200" />
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-6 w-16 rounded-full bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Info = ({ course, modules, tags, loading }) => {
  const navigate = useNavigate();
  const { enrollCourse, loading: enrollLoading } = useEnrollment();

  const handleEnroll = async () => {
    try {
      await enrollCourse(course.id);
      navigate("/dashboard/student/courses");
    } catch (err) {
      console.error("Enroll failed", err);
    }
  };

  if (loading || !course) return <InfoSkeleton />;

  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
      {/* Title & Description */}
      <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {course.title}
        </h1>
        <p className="mt-4 text-gray-700">{course.description}</p>
      </div>

      {/* Right Panel */}
      <div className="mt-4 lg:row-span-3 lg:mt-0">
        <p className="text-3xl tracking-tight text-gray-900">
          {course.price
            ? `Rp ${course.price.toLocaleString("id-ID")}`
            : "Free"}
        </p>

        {/* Reviews */}
        <div className="mt-6 flex items-center">
          <div className="flex items-center">
            {[0, 1, 2, 3, 4].map((rating) => (
              <FaStar
                key={rating}
                className={classNames(
                  course.rating > rating ? "text-yellow-400" : "text-gray-200",
                  "h-5 w-5"
                )}
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {course.rating} ({course.reviewsCount} reviews)
          </span>
        </div>

        {/* Enroll Button */}
        <button
          onClick={handleEnroll}
          disabled={enrollLoading}
          className="mt-10 flex w-full items-center justify-center rounded-md bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {enrollLoading ? "Memproses..." : "Enroll Now"}
        </button>
      </div>

      {/* Details */}
      <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pr-8">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Instructor</h3>
          <p className="mt-2 text-sm text-gray-600">{course.instructor_name}</p>
        </div>
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900">Modules</h3>
          <ul className="list-disc pl-4 text-sm text-gray-600 mt-2">
            {modules?.map((module) => (
              <li key={module.id} className="mb-2">
                <span className="font-semibold">{module.title}</span>
                {module.lessons && module.lessons.length > 0 && (
                  <ul className="list-decimal pl-6 mt-1 text-gray-500">
                    {module.lessons.map((lesson) => (
                      <li key={lesson.id}>{lesson.title}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900">Tags</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags?.map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;