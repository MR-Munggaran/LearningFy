import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

export const useEnrollment = () => {
  const { authUser } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const getConfig = () => ({
    withCredentials: true,
  });

  const enrollCourse = async (courseId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/v1/enrollment/courses/${courseId}/enroll`,
        {}, // body kosong
        getConfig()
      );
      toast.success("Berhasil mendaftar ke kursus!");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Gagal mendaftar ke kursus";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEnrollments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/enrollment/enrollments/me", getConfig());
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Gagal memuat daftar kursus";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollmentDetail = async (enrollmentId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/enrollment/enrollments/${enrollmentId}`, getConfig());
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Gagal memuat detail enrollment";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const cancelEnrollment = async (enrollmentId) => {
    setLoading(true);
    try {
      const response = await axios.put(`/api/v1/enrollment/enrollments/${enrollmentId}/cancel`, data, getConfig());
      toast.success("Enrollment berhasil dibatalkan!");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Gagal membatalkan enrollment";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    enrollCourse,
    fetchMyEnrollments,
    fetchEnrollmentDetail,
    cancelEnrollment,
  };
};
