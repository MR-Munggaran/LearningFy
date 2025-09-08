import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaBook, FaPlayCircle, FaListUl } from "react-icons/fa";
import { useModules } from "../hooks/useModules";
import { useLessons } from "../hooks/useLessons";
import { useParams } from "react-router-dom";
import { useProgress } from "../hooks/useProgress";

export default function LearningPage({ moduleId: propModuleId, courseId, enrollmentId:propEnrollId }) {
  const { moduleId: urlModuleId, enrollmentId: urlEnrollId } = useParams();
  const moduleId = propModuleId || urlModuleId;
  const enrollmentId = propEnrollId || urlEnrollId;

  const { fetchModules } = useModules();
  const { fetchLessons } = useLessons();
  const { updateLessonProgress } = useProgress();

  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState(null);

  // Load modules & lessons
  useEffect(() => {
    const loadData = async () => {

    const mods = await fetchModules(courseId);
    setModules(mods?.modules || []);

    const les = await fetchLessons(moduleId);
    const lessonArray = les?.lessons || [];
    setLessons(lessonArray);

      if (lessonArray.length > 0) {
        setLesson(lessonArray[0]); 
      }
    };
    loadData();
  }, [moduleId, courseId]);

  if (!lesson) {
    return <div className="p-6 text-center">Loading lessons...</div>;
  }

  function getYoutubeId(url) {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1); // ambil setelah '/'
      }
      return urlObj.searchParams.get("v"); // ambil ?v=xxxx
    } catch {
      return null;
    }
  }

  const handleNextLesson = () => {
      if (!lesson || lessons.length === 0) return;

      const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
      if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
        setLesson(lessons[currentIndex + 1]);
      } else {
        alert("You have completed all lessons 🎉");
      }
  };

  const updateProgress = async (enrollId, modId, status) => {
    try {
      await updateLessonProgress(enrollId, modId, status);
    } catch (err) {
      console.error("Update failed", err);
    }
  }

  return (
    <div className="min-h-screen py-16 px-6 lg:px-16">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-[#2563EB] mb-8 text-center"
      >
        {lesson.id}. {lesson.title}
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E2E8F0]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-[#2563EB] font-semibold">
                <FaPlayCircle />
                <span>{lesson.content_type}</span>
              </div>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              {lesson.content_type === "text" && (
                <>
                  {Array.isArray(lesson.content) ? (
                    lesson.content.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  ) : (
                    <p>{lesson.content}</p>
                  )}
                </>
              )}

              {lesson.content_type === "video" && (
                <div className="relative aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(lesson.resource_url)}`}
                    title={lesson.title}
                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {lesson.content_type === "pdf" && (
                <a
                  href={lesson.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#2563EB] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Download PDF
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          {/* Action Buttons */}
          <button
            onClick={handleNextLesson}
            className="w-full bg-[#2563EB] text-white rounded-xl py-4 font-semibold shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            Next Lesson <FaArrowRight />
          </button>
          <button 
            onClick={() => updateProgress(enrollmentId, moduleId, "completed")}
            className="w-full bg-[#10B981] text-white rounded-xl py-4 font-semibold shadow-md hover:bg-emerald-600 transition flex items-center justify-center gap-2"
          >
            Finish Module <FaBook />
          </button>

          {/* Modules */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-[#E2E8F0]">
            <h3 className="mb-3 font-bold text-[#2563EB] flex items-center gap-2">
              <FaListUl /> Modules
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              {modules.map((mod) => (
                <li
                  key={mod.id}
                  className="hover:bg-[#F1F5F9] px-2 py-1 rounded transition cursor-pointer"
                >
                  {mod.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Lessons */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-[#E2E8F0]">
            <h3 className="mb-3 font-bold text-[#2563EB] flex items-center gap-2">
              <FaBook /> Lessons
            </h3>
            <ul className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
              {lessons.map((les) => (
                <li
                  key={les.id}
                  onClick={() => setLesson(les)}
                  className={`cursor-pointer hover:text-[#2563EB] transition ${
                    les.id === lesson.id ? "font-bold text-[#2563EB]" : ""
                  }`}
                >
                  {les.title}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
