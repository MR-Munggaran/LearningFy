import { useState } from "react";
import { FaStar } from "react-icons/fa";
import QuillEditor from "./QuillEditor";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ReviewForm({ onSubmit }) {
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const plainText = newComment.replace(/<[^>]*>?/gm, "").trim();

    if (!newRating || !plainText) {
      alert("Rating dan komentar tidak boleh kosong.");
      return;
    }

    await onSubmit({ rating: newRating, comment: newComment });
    setNewRating(0);
    setNewComment("");
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

      <QuillEditor
        value={newComment}
        onChange={setNewComment}
        placeholder="Tulis review kamu..."
      />

      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Kirim Review
      </button>
    </form>
  );
}
