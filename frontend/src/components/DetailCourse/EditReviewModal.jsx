import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function EditReviewModal({ isOpen, onClose, review, onSave }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (review) {
      setRating(review.rating);
      setComment(review.comment);
    }
  }, [review]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;
    onSave({ ...review, rating, comment });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Edit Review
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                onClick={() => setRating(star)}
                className={classNames(
                  rating >= star ? "text-yellow-400" : "text-gray-300",
                  "h-6 w-6 cursor-pointer transition"
                )}
              />
            ))}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
            rows={3}
          />

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
