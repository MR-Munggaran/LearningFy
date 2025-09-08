import { FaStar } from "react-icons/fa";
import { MdModeEditOutline, MdDelete } from "react-icons/md";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ReviewList({ reviews, authUser, onEdit, onDelete }) {
  return (
    <div className="space-y-6">
      {reviews.length === 0 && (
        <p className="text-gray-500 text-sm">Belum ada review.</p>
      )}
      {reviews.map((rev) => (
        <div key={rev.id} className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((r) => (
                <FaStar
                  key={r}
                  className={classNames(
                    rev.rating > r ? "text-yellow-400" : "text-gray-200",
                    "h-4 w-4"
                  )}
                />
              ))}
              <span className="ml-2 text-sm font-medium text-gray-800">
                {rev.user_name || "Anonymous"}
              </span>
            </div>

            {authUser && rev.user_id === authUser.user.id && (
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(rev)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  <MdModeEditOutline/>
                </button>
                <button
                  onClick={() => onDelete(rev.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  <MdDelete/>
                </button>
              </div>
            )}
          </div>
          <p className="mt-2 text-gray-600 text-sm">{rev.comment.replace(/<[^>]*>?/gm, "")}</p>
        </div>
      ))}
    </div>
  );
}
