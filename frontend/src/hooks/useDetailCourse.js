import { useEffect, useState } from "react";
import { useCourses } from "./useCourses";
import { useModules } from "./useModules";
import { useLessons } from "./useLessons";
import useTags from "./useTags";
import { useReview } from "./useReview";

export function useDetailCourse(id) {
  const { fetchCourseDetail, fetchCourses } = useCourses();
  const { fetchModules } = useModules();
  const { fetchLessons } = useLessons();
  const { getTagsByCourse } = useTags();
  const { getCourseReviews, createReview, updateReview, deleteReview } = useReview();

  const [state, setState] = useState({
    course: {},
    modules: [],
    allCourses: [],
    similarCourses: [],
    tags: [],
    reviews: [],
    loading: true,
  });

  // --- fetch data utama ---
  useEffect(() => {
    const load = async () => {
      try {
        const [courseRes, modulesRes, coursesRes, tagsRes, reviewsRes] = await Promise.all([
          fetchCourseDetail(id),
          fetchModules(id),
          fetchCourses(),
          getTagsByCourse(id),
          getCourseReviews(id),
        ]);

        const courseData = courseRes.course || {};
        const modulesData = modulesRes.modules || [];
        const allCoursesData = coursesRes.courses || [];
        const reviewsData = reviewsRes.reviews || [];
        const tagsData = tagsRes.data || [];

        // Cari similar courses
        const similar = allCoursesData
          .filter((c) => c.category_name === courseData.category_name && c.id !== Number(id))
          .slice(0, 3);

        // Ambil lessons per module
        const allLessons = await Promise.all(modulesData.map((m) => fetchLessons(m.id)));
        const modulesWithLessons = modulesData.map((m, i) => ({
          ...m,
          lessons: allLessons[i]?.lessons || [],
        }));

        setState({
          course: courseData,
          modules: modulesWithLessons,
          allCourses: allCoursesData,
          similarCourses: similar,
          tags: tagsData,
          reviews: reviewsData,
          loading: false,
        });
      } catch (err) {
        console.error("Error load detail course:", err);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    load();
  }, [id]);

  // --- helper untuk refresh reviews ---
  const refreshReviews = async () => {
    const res = await getCourseReviews(id);
    setState((prev) => ({ ...prev, reviews: res.reviews || [] }));
  };

  // --- actions reviews ---
  const handleCreateReview = async (reviewData) => {
    await createReview(id, reviewData);
    await refreshReviews();
  };

  const handleUpdateReview = async (reviewId, updatedData) => {
    await updateReview(reviewId, updatedData);
    await refreshReviews();
  };

  const handleDeleteReview = async (reviewId) => {
    await deleteReview(reviewId);
    await refreshReviews();
  };

  return {
    ...state,
    handleCreateReview,
    handleUpdateReview,
    handleDeleteReview,
    refreshReviews,
  };
}
