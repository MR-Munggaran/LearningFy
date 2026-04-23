import { Link } from "react-router-dom";
import { useCourses } from "../../hooks/useCourses";
import { getImageUrl } from "../getImageUrl";
import { useEffect, useState } from "react";

function CourseSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
      {/* Thumbnail placeholder */}
      <div className="w-full rounded-lg bg-gray-200 aspect-square sm:aspect-[2/1] lg:aspect-square" />
      <div className="mt-6 space-y-3">
        {/* Title */}
        <div className="h-4 w-3/4 rounded-full bg-gray-200" />
        {/* Description line 1 */}
        <div className="h-3 w-full rounded-full bg-gray-200" />
        {/* Description line 2 */}
        <div className="h-3 w-2/3 rounded-full bg-gray-200" />
        {/* Instructor */}
        <div className="h-3 w-1/3 rounded-full bg-blue-100" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-3 flex flex-col items-center gap-4 py-20 text-gray-400">
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
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25"
        />
      </svg>
      <p className="text-base font-medium">Belum ada course tersedia</p>
      <p className="text-sm">Cek lagi nanti ya 👀</p>
    </div>
  );
}

export default function PopularCourses() {
  const [course, setCourse] = useState([]);
  const { fetchCourses, loading } = useCourses();

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await fetchCourses();
        setCourse(data.courses || []);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };
    loadCourse();
  }, []);

  const popularCourses = course.slice(0, 3);

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          {/* Heading + CTA */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 my-5">
                Popular Courses
              </h2>
              <p className="mt-2 text-sm text-gray-600 max-w-xl">
                Belajar skill terbaru dari mentor berpengalaman. Pilih course
                favoritmu dan mulai tingkatkan karier coding & desainmu hari ini 🚀
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                to="/course"
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
              >
                🎓 Browse All Courses
              </Link>
            </div>
          </div>

          {/* Course Grid */}
          <div className="mt-8 space-y-12 lg:grid lg:grid-cols-3 lg:space-y-0 lg:gap-x-6">
            {loading ? (
              // Skeleton: 3 card placeholder
              Array.from({ length: 3 }).map((_, i) => (
                <CourseSkeleton key={i} />
              ))
            ) : popularCourses.length === 0 ? (
              // Empty state
              <EmptyState />
            ) : (
              popularCourses.map((course) => (
                <div
                  key={course.id}
                  className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
                >
                  <img
                    alt={course.title}
                    src={getImageUrl(course.image)}
                    className="w-full rounded-lg object-cover group-hover:opacity-90 max-sm:h-80 sm:aspect-[2/1] lg:aspect-square"
                  />
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      <Link to={`/course/${course.id}`}>
                        <span className="absolute inset-0" />
                        {course.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {course.description.length > 50
                        ? course.description.substring(0, 50) + "..."
                        : course.description}
                    </p>
                    <p className="mt-2 text-xs text-blue-600 font-medium">
                      By {course.instructor_name}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}