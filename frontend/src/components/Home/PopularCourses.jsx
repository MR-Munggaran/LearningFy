import { Link } from "react-router-dom";
import { useCourses } from "../../hooks/useCourses";
import { getImageUrl } from "../getImageUrl";
import { useEffect, useState } from "react";


export default function PopularCourses() {
  const [course, setCourse] = useState([]);
  const {fetchCourses, loading} = useCourses(); // asumsi hook return [data, loading]

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
            {popularCourses.map((course) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
