// 1. Import hook tambahan: useEffect dan useRef
import { useState, useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";

// 2. Import Quill dan CSS-nya (PENTING!)
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import tema default "snow"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ReviewForm({ onSubmit }) {
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState(""); 

  const quillInstanceRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillInstanceRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow', // Tema 'snow' memiliki toolbar standar
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link'],
          ],
        },
        placeholder: 'Tulis review kamu...',
      });

      // Simpan instance ke ref
      quillInstanceRef.current = quill;

      // 4. Sinkronisasi state: Update state React (newComment) ketika Quill berubah
      quill.on('text-change', () => {
        // Ambil konten HTML dari editor Quill dan simpan ke state React
        setNewComment(quill.root.innerHTML);
      });
    }

    // Cleanup logic (opsional tapi best practice)
    // return () => {
    //   if (quillInstanceRef.current) {
    //     // Hapus listener atau hancurkan instance jika diperlukan saat unmount
    //   }
    // };
  }, []); // Dependensi kosong [] berarti useEffect ini hanya berjalan sekali saat mount

  const handleSubmit = async (e) => {
    e.preventDefault();

    const commentText = newComment.replace(/<[^>]*>?/gm, '').trim();
    if (!newRating || !commentText) {
        alert("Rating dan komentar tidak boleh kosong.");
        return;
    }

    await onSubmit({ rating: newRating, comment: newComment });

    setNewRating(0);
    setNewComment("");

    if (quillInstanceRef.current) {
      quillInstanceRef.current.setText(""); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            onClick={() => setNewRating(star)}
            className={classNames(
              newRating >= star ? "text-yellow-400" : "text-gray-300",
              "h-6 w-6 cursor-pointer transition"
            )}
          />
        ))}
      </div>

      <div className="quill-editor-container">
        <div ref={editorRef} style={{ minHeight: '120px' }} />
      </div>

      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Kirim Review
      </button>
    </form>
  );
}