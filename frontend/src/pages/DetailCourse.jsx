import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useDetailCourse } from "../hooks/useDetailCourse";

import Breadcumb from "../components/DetailCourse/Breadcumb";
import SingleImage from "../components/DetailCourse/SingleImage";
import Info from "../components/DetailCourse/Info";
import SimilarCourse from "../components/DetailCourse/SimilarCourse";
import ReviewForm from "../components/DetailCourse/ReviewForm";
import ReviewList from "../components/DetailCourse/ReviewList";
import EditReviewModal from "../components/DetailCourse/EditReviewModal";

export default function DetailCourse() {
  const { id } = useParams();
  const {
    course,
    modules,
    similarCourses,
    tags,
    reviews,
    loading,
    handleCreateReview,
    handleUpdateReview,
    handleDeleteReview,
  } = useDetailCourse(id);

  const { authUser } = useAuthContext();
  const [editingReview, setEditingReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="bg-white my-[8rem]">
      <div className="pt-6">
        <Breadcumb course={course} />
        <SingleImage course={course} />
        <Info course={course} modules={modules} tags={tags} />
        <SimilarCourse similarCourses={similarCourses} />

        {/* Reviews */}
        <div className="mx-auto max-w-7xl px-4 mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Student Reviews</h2>

          {authUser?.user?.role === "student" && (
            <ReviewForm onSubmit={handleCreateReview} />
          )}

          <ReviewList
            reviews={reviews}
            authUser={authUser}
            onEdit={(rev) => {
              setEditingReview(rev);
              setIsModalOpen(true);
            }}
            onDelete={handleDeleteReview}
          />
        </div>

        {/* Modal Edit Review */}
        <EditReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          review={editingReview}
          onSave={(updated) =>
            handleUpdateReview(updated.id, {
              rating: updated.rating,
              comment: updated.comment,
            })
          }
        />
      </div>
    </div>
  );
}
