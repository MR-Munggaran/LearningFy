import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLessons } from "../../hooks/useLessons";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { FaArrowLeft, FaYoutube, FaFilePdf, FaFont, FaEye, FaEyeSlash, FaUpload } from "react-icons/fa";

// ─── Helper: ekstrak YouTube ID ───────────────────────────────────────────────
function getYoutubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1);
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

// ─── Content Type Option Card ─────────────────────────────────────────────────
function TypeCard({ type, icon, label, color, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(type)}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
        selected
          ? `${color} border-current shadow-sm scale-105`
          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

// ─── Video Input ──────────────────────────────────────────────────────────────
function VideoInput({ value, onChange }) {
  const youtubeId = getYoutubeId(value);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          YouTube URL
        </label>
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <FaYoutube className="text-red-500 text-xl flex-shrink-0" />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full outline-none text-sm"
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Dukung format youtube.com/watch?v= dan youtu.be/
        </p>
      </div>

      {/* Live Preview */}
      {youtubeId && (
        <div className="rounded-xl overflow-hidden shadow-md">
          <div className="bg-gray-800 px-3 py-1.5 text-xs text-gray-400 flex items-center gap-2">
            <FaEye /> Preview
          </div>
          <div className="relative aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="Video preview"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PDF Input (Diubah menjadi Upload File) ───────────────────────────────────
function PdfInput({ value, file, onFileChange }) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value || "");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onFileChange(selectedFile);
      // Membuat URL sementara (local) untuk preview file yang baru diunggah
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    } else {
      onFileChange(null);
      setPreviewUrl(value || ""); // Kembalikan ke URL lama jika batal pilih file
    }
  };

  // Bersihkan object URL dari memori ketika komponen unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Sinkronisasi dengan initial value saat edit
  useEffect(() => {
    if (value && !file) {
      setPreviewUrl(value);
    }
  }, [value, file]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload PDF
        </label>
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500">
          <FaUpload className="text-gray-400 text-lg flex-shrink-0" />
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full text-sm outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          Maksimal ukuran file disesuaikan dengan aturan server Anda.
        </p>
      </div>

      {previewUrl && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
          >
            {showPreview ? <FaEyeSlash /> : <FaEye />}
            {showPreview ? "Sembunyikan Preview" : "Lihat Preview PDF"}
          </button>
          {showPreview && (
            <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 bg-gray-50">
              <div className="bg-gray-800 px-3 py-1.5 text-xs text-gray-400">
                Preview PDF {file ? "(File Lokal)" : ""}
              </div>
              <iframe
                src={`${previewUrl}#toolbar=0`}
                title="PDF preview"
                className="w-full h-[500px]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Text (Quill) Input ───────────────────────────────────────────────────────
function TextInput({ value, onChange }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["blockquote", "code-block"],
            ["link"],
            ["clean"],
          ],
        },
        placeholder: "Tulis materi pelajaran di sini...",
      });

      if (value) {
        quill.root.innerHTML = value;
      }

      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });

      quillRef.current = quill;
    }
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Konten Materi
      </label>
      <div className="rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
        <div ref={editorRef} style={{ minHeight: "280px" }} />
      </div>
      <p className="text-xs text-gray-400">
        Gunakan toolbar untuk format teks, heading, list, kode, dan lainnya.
      </p>
    </div>
  );
}

// ─── Main Form Page ───────────────────────────────────────────────────────────
export default function LessonFormPage() {
  const navigate = useNavigate();
  const { moduleId, lessonId } = useParams();

  const isEdit = !!lessonId;

  const { createLesson, updateLesson, fetchLessonById, loading } = useLessons();

  const [formData, setFormData] = useState({
    title: "",
    content_type: "text",
    content: "",
    resource_url: "", 
    file: null, // <-- Tambahan state untuk menyimpan file upload
    position: 1,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Load lesson data jika edit
  useEffect(() => {
    if (isEdit) {
      const load = async () => {
        try {
          const data = await fetchLessonById(lessonId);
          const lesson = data.lesson || data;
          setFormData({
            title: lesson.title || "",
            content_type: lesson.content_type || "text",
            content: lesson.content || "",
            resource_url: lesson.resource_url || "",
            file: null,
            position: lesson.position || 1,
          });
        } catch (err) {
          console.error("Failed to load lesson", err);
        }
      };
      load();
    }
  }, [isEdit, lessonId]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Judul wajib diisi";
    
    if (formData.content_type === "text") {
      const stripped = formData.content.replace(/<[^>]*>?/gm, "").trim();
      if (!stripped) newErrors.content = "Konten teks wajib diisi";
    }
    
    if (formData.content_type === "video" && !formData.resource_url.trim()) {
      newErrors.resource_url = "URL YouTube wajib diisi";
    }
    
    // Validasi PDF: harus ada file baru atau resource_url lama (jika sedang edit)
    if (formData.content_type === "pdf" && !formData.file && !formData.resource_url) {
      newErrors.file = "File PDF wajib diunggah";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      /* Catatan: 
        Karena ada pengiriman File, pastikan di dalam fungsi `createLesson` dan `updateLesson` 
        (di hook useLessons) Anda mengubah format pengiriman menjadi `FormData` (multipart/form-data)
        bukan JSON biasa.
        
        Contoh di hook useLessons Anda nanti:
        const payload = new FormData();
        payload.append("title", formData.title);
        if (formData.file) payload.append("file", formData.file);
        // ... dst
      */
      
      if (isEdit) {
        await updateLesson(lessonId, formData);
      } else {
        await createLesson(moduleId, formData);
      }
      navigate(-1);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  const contentTypes = [
    { type: "text", icon: <FaFont />, label: "Text", color: "text-blue-600 bg-blue-50 border-blue-400" },
    { type: "video", icon: <FaYoutube />, label: "Video", color: "text-red-600 bg-red-50 border-red-400" },
    { type: "pdf", icon: <FaFilePdf />, label: "PDF", color: "text-orange-600 bg-orange-50 border-orange-400" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition mb-6 text-sm"
        >
          <FaArrowLeft /> Kembali ke Manage Lessons
        </button>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2563EB]">
            {isEdit ? "✏️ Edit Lesson" : "➕ Tambah Lesson Baru"}
          </h1>
          {moduleId && (
            <p className="text-sm text-gray-500 mt-1">
              Module ID: <span className="font-medium text-gray-700">{moduleId}</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ── Section 1: Info Dasar ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-700 border-b pb-3">
              Informasi Dasar
            </h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Lesson <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="Contoh: Pengenalan React Hooks"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm ${
                  errors.title ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posisi (Urutan)
              </label>
              <input
                type="number"
                min="1"
                value={formData.position}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, position: parseInt(e.target.value) || 1 }))
                }
                className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
              <p className="mt-1 text-xs text-gray-400">
                Urutan tampil lesson dalam modul ini
              </p>
            </div>
          </div>

          {/* ── Section 2: Tipe Konten ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-700 border-b pb-3">
              Tipe Konten
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {contentTypes.map(({ type, icon, label, color }) => (
                <TypeCard
                  key={type}
                  type={type}
                  icon={icon}
                  label={label}
                  color={color}
                  selected={formData.content_type === type}
                  onClick={(t) => {
                    setFormData((p) => ({
                      ...p,
                      content_type: t,
                      content: "",
                      resource_url: "",
                      file: null // reset file saat pindah tab
                    }));
                    setErrors({});
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Section 3: Konten Dinamis ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="text-base font-semibold text-gray-700 border-b pb-3">
              {formData.content_type === "text" && "📝 Konten Teks"}
              {formData.content_type === "video" && "🎬 Konten Video"}
              {formData.content_type === "pdf" && "📄 Konten PDF"}
            </h2>

            {formData.content_type === "text" && (
              <>
                <TextInput
                  value={formData.content}
                  onChange={(val) => setFormData((p) => ({ ...p, content: val }))}
                />
                {errors.content && (
                  <p className="text-xs text-red-500">{errors.content}</p>
                )}
              </>
            )}

            {formData.content_type === "video" && (
              <>
                <VideoInput
                  value={formData.resource_url}
                  onChange={(val) =>
                    setFormData((p) => ({ ...p, resource_url: val }))
                  }
                />
                {errors.resource_url && (
                  <p className="text-xs text-red-500">{errors.resource_url}</p>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Video (opsional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, content: e.target.value }))
                    }
                    placeholder="Tuliskan ringkasan atau catatan tentang video ini..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                  />
                </div>
              </>
            )}

            {formData.content_type === "pdf" && (
              <>
                {/* Diubah memanggil komponen PdfInput yang baru */}
                <PdfInput
                  value={formData.resource_url}
                  file={formData.file}
                  onFileChange={(f) =>
                    setFormData((p) => ({ ...p, file: f }))
                  }
                />
                {errors.file && (
                  <p className="text-xs text-red-500">{errors.file}</p>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
                    Deskripsi PDF (opsional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, content: e.target.value }))
                    }
                    placeholder="Tuliskan ringkasan atau instruksi untuk dokumen ini..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                  />
                </div>
              </>
            )}
          </div>

          {/* ── Submit ── */}
          <div className="flex gap-3 pb-10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving || loading}
              className="flex-1 px-6 py-3 bg-[#2563EB] text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Menyimpan..." : isEdit ? "Update Lesson" : "Simpan Lesson"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}