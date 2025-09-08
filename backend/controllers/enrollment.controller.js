import { EnrollmentModel } from "../models/Enrollment.js";

export const enrollCourse = async (req, res) => {
  try {
    const { id: course_id } = req.params;
    // pastikan ada middleware auth
    const user_id = req.user.id; 

    const enrollment = await EnrollmentModel.enroll({ user_id, course_id });
    return res.status(201).json({ success: true, enrollment });
  } catch (error) {
    console.error("Error in enrollCourse:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const myEnrollments = async (req, res) => {
  try {
    const user_id = req.user.id;

    const enrollments = await EnrollmentModel.findByUser(user_id);
    return res.status(200).json({ success: true, enrollments });
  } catch (error) {
    console.error("Error in myEnrollments:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const enrollmentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await EnrollmentModel.findById(id);

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    // opsional: pastikan hanya pemilik atau admin/instructor yang bisa lihat
    if (req.user.role !== "admin" && req.user.id !== enrollment.user_id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    return res.status(200).json({ success: true, enrollment });
  } catch (error) {
    console.error("Error in enrollmentDetail:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const cancelEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await EnrollmentModel.findById(id);

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    // hanya student pemilik atau admin yang boleh cancel
    if (req.user.role !== "admin" && req.user.id !== enrollment.user_id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const cancelled = await EnrollmentModel.cancel(id);
    return res.status(200).json({ success: true, enrollment: cancelled });
  } catch (error) {
    console.error("Error in cancelEnrollment:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
