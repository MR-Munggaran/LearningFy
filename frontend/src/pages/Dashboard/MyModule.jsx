import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useModules } from "../../hooks/useModules";
import LearningPage from "../LearningPage";
import { useProgress } from "../../hooks/useProgress";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function MyModule() {
  const { id } = useParams();
  const { state } = useLocation();
  const enrollmentId = state?.enrollmentId;

  const [myModule, setMyModule] = useState([]);
  const [view, setView] = useState("modules");
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  const { fetchModules } = useModules();
  const { updateLessonProgress, getCourseProgress } = useProgress();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchModules(id);
        setMyModule(data.modules || []);

        // cek progress
        if (enrollmentId) {
          const progressData = await getCourseProgress(enrollmentId);
          // misal API balikin array lessons progress
          const anyInProgress = progressData.some(
            (p) => p.status === "in_progress"
          );
          if (anyInProgress) setHasStarted(true);
        }
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };

    loadData();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id, enrollmentId]);

  const startLearningAll = async () => {
    try {
      // jalankan update untuk semua module sekaligus
      await Promise.all(
        myModule.map((module) =>
          updateLessonProgress(enrollmentId, module.id, "in_progress")
        )
      );
      setHasStarted(true);
    } catch (err) {
      console.error("Failed to start all modules", err);
    }
  };

  // Jika sedang view lessons
  if (view === "lessons") {
    return (
      <div className="m-5">
        <button
          onClick={() => {
            setView("modules");
            setActiveModuleId(null);
          }}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          ⬅ Back to Modules
        </button>
        <LearningPage
          moduleId={activeModuleId}
          courseId={id}
          enrollmentId={enrollmentId}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-10 sm:py-16 lg:max-w-none lg:py-20">
          <h2 className="text-2xl font-bold text-[#2563EB] mb-6">
            📚 My Courses
          </h2>

          {/* Tombol Mulai Belajar sekali klik */}
          {!hasStarted && (
            <div className="mb-8">
              <button
                onClick={startLearningAll}
                className="px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition w-full"
              >
                🚀 Mulai Belajar
              </button>
            </div>
          )}

          {/* Grid dengan animasi */}
          <motion.div
            className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {myModule.map((module) => (
              <motion.div
                key={module.id}
                variants={cardVariants}
                className="group relative bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {module.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    Posisi: {module.position}
                  </p>

                  <div className="mt-4 text-sm text-gray-700">
                    {module.description.length > 60
                      ? module.description.substring(0, 60) + "..."
                      : module.description}
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setActiveModuleId(module.id);
                        setView("lessons");
                      }}
                      disabled={!hasStarted}
                      className={`inline-block w-full text-center px-4 py-2 rounded-lg font-medium transition ${
                        hasStarted
                          ? "bg-[#2563EB] text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      📖 Lihat Lessons
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
