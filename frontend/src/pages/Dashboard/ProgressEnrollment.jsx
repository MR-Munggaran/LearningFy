import { useEffect, useMemo, useState } from "react";
import { useProgress } from "../../hooks/useProgress";
import { useEnrollment } from "../../hooks/useEnrollment";
import { FaChevronDown, FaCheck } from "react-icons/fa";
import {formatDate} from '../../components/formatDate'

const statusStyles = {
  not_started: "bg-gray-200 text-gray-600",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
};

export default function ProgressEnrollment() {
  const { getCourseProgress } = useProgress(); // ambil dari hook progress
  const { fetchMyEnrollments } = useEnrollment();

  const [myCourse, setMyCourse] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const loadMyProgress = async () => {
      try {
        const data = await fetchMyEnrollments();
        setMyCourse(data.enrollments || []);
      } catch (err) {
        console.error("Failed to fetch all courses", err);
      }
    };
    loadMyProgress();
  }, []);

  // hitung progress
  const { completed, total, percentage } = useMemo(() => {
    const total = lessons.length;
    const completed = lessons.filter((l) => l.status === "completed").length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }, [lessons]);

  // load progress tiap course dipilih
  const loadCourseProgress = async (id) => {
    try {
      const data = await getCourseProgress(id);
      console.log(data)
      setLessons(data || []);
    } catch (err) {
      console.error("Failed to load course progress", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        📖 Course Progress
      </h2>

      {/* Dropdown pilih course */}
      <div className="w-64 mb-8">
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Pilih Course
        </label>
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div className="flex items-center gap-2">
              <span>
                {selected ? selected.course_title : "Pilih course..."}
              </span>
            </div>
            <FaChevronDown className="text-gray-500" />
          </button>

          {open && (
            <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
              {myCourse.map((enroll) => (
                <li
                  key={enroll.id}
                  onClick={() => {
                    setSelected(enroll);
                    loadCourseProgress(enroll.id);
                    setOpen(false);
                  }}
                  className={`flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-indigo-600 hover:text-white ${
                    selected?.id === enroll.id ? "bg-indigo-50" : ""
                  }`}
                >
                  <span className="flex-1">{enroll.course_title}</span>
                  {selected?.id === enroll.id && (
                    <FaCheck className="text-indigo-600 group-hover:text-white" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {selected && (
        <>
          <div className="mb-6">
            <div className="flex justify-between mb-1 text-sm text-gray-700">
              <span>
                {completed} of {total} lessons completed
              </span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Lessons List */}
          <ul role="list" className="divide-y divide-gray-200">
            {lessons.map((lesson) => (
              <li
                key={lesson.id}
                className="flex justify-between items-center gap-x-6 py-5"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {lesson.module_title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Selesai: {lesson.completed_at? formatDate(lesson.completed_at) : 'Belum Selesai' }
                  </p>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[lesson.status]}`}
                  >
                    {lesson.status === "not_started" && "Not Started"}
                    {lesson.status === "in_progress" && "In Progress"}
                    {lesson.status === "completed" && "Completed"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
