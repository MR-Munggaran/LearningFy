import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaBook,
  FaPlayCircle,
  FaListUl,
  FaFilePdf,
  FaFont,
  FaExpandAlt,
  FaCompressAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useModules } from "../hooks/useModules";
import { useLessons } from "../hooks/useLessons";
import { useParams } from "react-router-dom";
import { useProgress } from "../hooks/useProgress";

// ─── Helper ───────────────────────────────────────────────────────────────────
function getYoutubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

// ─── Content Type Icon ────────────────────────────────────────────────────────
function ContentTypeIcon({ type }) {
  const map = {
    video: { icon: <FaPlayCircle />, color: "text-red-500", label: "Video" },
    pdf: { icon: <FaFilePdf />, color: "text-orange-500", label: "PDF" },
    text: { icon: <FaFont />, color: "text-blue-500", label: "Teks" },
  };
  const item = map[type] || { icon: <FaBook />, color: "text-gray-500", label: type };
  return (
    <span className={`flex items-center gap-1.5 text-sm font-semibold ${item.color}`}>
      {item.icon} {item.label}
    </span>
  );
}

// ─── Video Viewer ─────────────────────────────────────────────────────────────
function VideoViewer({ lesson }) {
  const youtubeId = getYoutubeId(lesson.resource_url);

  return (
    <div className="space-y-4">
      {youtubeId ? (
        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
            title={lesson.title}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-12 bg-gray-50 rounded-xl text-gray-400">
          <FaPlayCircle className="text-4xl opacity-30" />
          <p className="text-sm">URL video tidak valid</p>
        </div>
      )}

      {/* Deskripsi video */}
      {lesson.content && (
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed border border-gray-100">
          <p className="font-semibold text-gray-700 mb-1">Tentang video ini:</p>
          <p>{lesson.content}</p>
        </div>
      )}
    </div>
  );
}

// ─── PDF Viewer ───────────────────────────────────────────────────────────────
function PdfViewer({ lesson }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-3">
      {/* Deskripsi PDF */}
      {lesson.content && (
        <div className="bg-orange-50 rounded-xl p-4 text-sm text-gray-600 leading-relaxed border border-orange-100">
          <p className="font-semibold text-gray-700 mb-1">Tentang dokumen ini:</p>
          <p>{lesson.content}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <a
          href={lesson.resource_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium"
        >
          <FaExternalLinkAlt /> Buka di tab baru
        </a>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition"
        >
          {expanded ? <FaCompressAlt /> : <FaExpandAlt />}
          {expanded ? "Perkecil" : "Perbesar"}
        </button>
      </div>

      {/* PDF embed */}
      <div
        className={`rounded-xl overflow-hidden border border-gray-200 shadow-md transition-all duration-300 ${
          expanded ? "h-[80vh]" : "h-[520px]"
        }`}
      >
        <iframe
          src={`${lesson.resource_url}#toolbar=1&navpanes=0`}
          title={lesson.title}
          className="w-full h-full"
          type="application/pdf"
        />
      </div>
    </div>
  );
}

// ─── Text Viewer ──────────────────────────────────────────────────────────────
function TextViewer({ lesson }) {
  const [fontSize, setFontSize] = useState(16); // px
  const [lineHeight, setLineHeight] = useState(1.8);

  const fontSizes = [14, 16, 18, 20, 22];
  const lineHeights = [1.5, 1.8, 2.0, 2.4];

  return (
    <div className="space-y-4">
      {/* Reading controls */}
      <div className="flex flex-wrap items-center gap-4 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
        {/* Font size */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Ukuran teks:</span>
          <div className="flex gap-1">
            {fontSizes.map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                  fontSize === size
                    ? "bg-[#2563EB] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Line height */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Spasi baris:</span>
          <div className="flex gap-1">
            {lineHeights.map((lh) => (
              <button
                key={lh}
                onClick={() => setLineHeight(lh)}
                className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                  lineHeight === lh
                    ? "bg-[#2563EB] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {lh}×
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content area — render Quill HTML dengan prose styles */}
      <div
        className="bg-white rounded-xl border border-gray-100 shadow-sm px-8 py-6 text-gray-800"
        style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
      >
        {/* Quill HTML content — ql-snow styling dipakai lewat className */}
        <div
          className="ql-snow"
        >
          <div
            className="ql-editor prose max-w-none"
            style={{ padding: 0 }}
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function LearningPageSkeleton() {
  return (
    <div className="min-h-screen py-16 px-6 lg:px-16 animate-pulse">
      <div className="h-8 w-2/3 mx-auto rounded-full bg-gray-200 mb-10" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white rounded-2xl shadow p-6 space-y-4">
          <div className="h-5 w-24 rounded-full bg-gray-200" />
          <div className="aspect-video rounded-xl bg-gray-100" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-12 w-full rounded-xl bg-blue-100" />
          <div className="h-12 w-full rounded-xl bg-green-100" />
          <div className="bg-white rounded-2xl shadow p-5 space-y-3">
            <div className="h-4 w-20 rounded-full bg-gray-200" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-3 w-full rounded-full bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LearningPage({ moduleId: propModuleId, courseId, enrollmentId: propEnrollId }) {
  const { moduleId: urlModuleId, enrollmentId: urlEnrollId } = useParams();
  const moduleId = propModuleId || urlModuleId;
  const enrollmentId = propEnrollId || urlEnrollId;

  const { fetchModules } = useModules();
  const { fetchLessons } = useLessons();
  const { updateLessonProgress } = useProgress();

  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const mods = await fetchModules(courseId);
        setModules(mods?.modules || []);

        const les = await fetchLessons(moduleId);
        const lessonArray = les?.lessons || [];
        setLessons(lessonArray);
        if (lessonArray.length > 0) setLesson(lessonArray[0]);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [moduleId, courseId]);

  // Scroll ke atas tiap ganti lesson
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lesson?.id]);

  if (loading) return <LearningPageSkeleton />;

  if (!lesson) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-gray-400">
        <FaBook className="text-5xl opacity-30" />
        <p className="text-base font-medium">Belum ada lesson di modul ini</p>
      </div>
    );
  }

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
    if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
      setLesson(lessons[currentIndex + 1]);
    } else {
      alert("Kamu sudah menyelesaikan semua lesson! 🎉");
    }
  };

  const handleFinishModule = async () => {
    try {
      await updateLessonProgress(enrollmentId, moduleId, "completed");
      alert("Modul ditandai selesai ✅");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
  const isLastLesson = currentIndex === lessons.length - 1;

  return (
    <div className="min-h-screen py-16 px-6 lg:px-16">
      {/* Header */}
      <motion.div
        key={lesson.id}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 text-center"
      >
        <p className="text-sm text-gray-400 mb-1">
          Lesson {currentIndex + 1} dari {lessons.length}
        </p>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#2563EB]">
          {lesson.title}
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ── Content Area ── */}
        <motion.div
          key={`content-${lesson.id}`}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E2E8F0]">
            {/* Content type label */}
            <div className="flex justify-between items-center mb-5">
              <ContentTypeIcon type={lesson.content_type} />
              {/* Progress indicator */}
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                {currentIndex + 1}/{lessons.length}
              </span>
            </div>

            {/* Dynamic content */}
            {lesson.content_type === "video" && <VideoViewer lesson={lesson} />}
            {lesson.content_type === "pdf" && <PdfViewer lesson={lesson} />}
            {lesson.content_type === "text" && <TextViewer lesson={lesson} />}
          </div>

          {/* Bottom nav */}
          <div className="flex gap-3 mt-4">
            <button
              disabled={currentIndex === 0}
              onClick={() => setLesson(lessons[currentIndex - 1])}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-30"
            >
              ← Lesson Sebelumnya
            </button>
            <button
              onClick={handleNextLesson}
              className="flex-1 py-3 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              {isLastLesson ? "Selesai 🎉" : <>Lesson Berikutnya <FaArrowRight /></>}
            </button>
          </div>
        </motion.div>

        {/* ── Sidebar ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4"
        >
          {/* Finish module button */}
          <button
            onClick={handleFinishModule}
            className="w-full bg-[#10B981] text-white rounded-xl py-3 font-semibold shadow-md hover:bg-emerald-600 transition flex items-center justify-center gap-2 text-sm"
          >
            Tandai Selesai <FaBook />
          </button>

          {/* Modules list */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-[#E2E8F0]">
            <h3 className="mb-3 font-bold text-[#2563EB] flex items-center gap-2 text-sm">
              <FaListUl /> Semua Modul
            </h3>
            <ul className="space-y-1 text-sm">
              {modules.map((mod) => (
                <li
                  key={mod.id}
                  className={`px-2 py-1.5 rounded transition cursor-pointer ${
                    mod.id === moduleId
                      ? "bg-blue-50 text-[#2563EB] font-semibold"
                      : "text-gray-600 hover:bg-[#F1F5F9]"
                  }`}
                >
                  {mod.title}
                </li>
              ))}
            </ul>
          </div>

          {/* Lessons list */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-[#E2E8F0]">
            <h3 className="mb-3 font-bold text-[#2563EB] flex items-center gap-2 text-sm">
              <FaBook /> Lesson dalam Modul
            </h3>
            <ul className="space-y-1 text-sm">
              {lessons.map((les, idx) => (
                <li
                  key={les.id}
                  onClick={() => setLesson(les)}
                  className={`flex items-center gap-2 px-2 py-2 rounded cursor-pointer transition ${
                    les.id === lesson.id
                      ? "bg-blue-50 text-[#2563EB] font-bold"
                      : "text-gray-600 hover:bg-[#F1F5F9]"
                  }`}
                >
                  {/* Content type mini badge */}
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    les.content_type === "video"
                      ? "bg-red-400"
                      : les.content_type === "pdf"
                      ? "bg-orange-400"
                      : "bg-blue-400"
                  }`} />
                  <span>{idx + 1}. {les.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}