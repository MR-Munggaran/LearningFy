import { ProgressModel } from "../models/Progress.js";

export const updateProgress = async (req, res) => {
  try {
    const { enrollment_id, module_id, status } = req.body;

    // Cek input wajib
    if (!enrollment_id || !module_id || !status) {
      return res.status(400).json({
        success: false,
        message: "enrollment_id, module_id, dan status wajib diisi",
      });
    }

    // Validasi status
    const allowedStatus = ["not_started", "in_progress", "completed"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status tidak valid, gunakan salah satu dari: ${allowedStatus.join(
          ", "
        )}`,
      });
    }

    // Validasi module_id
    const moduleExists = await ProgressModel.validateModule(module_id);
    if (!moduleExists) {
      return res.status(404).json({ message: "Module tidak ditemukan" });
    }

    // Validasi enrollment_id
    const enrollmentExists = await ProgressModel.validateEnrollment(enrollment_id);
    if (!enrollmentExists) {
      return res.status(404).json({ message: "Enrollment tidak ditemukan" });
    }

    // Lanjut update / insert
    const existing = await ProgressModel.findOne(enrollment_id, module_id);
    let progress;

    if (existing) {
      progress = await ProgressModel.update({ enrollment_id, module_id, status });
    } else {
      progress = await ProgressModel.create({ enrollment_id, module_id, status });
    }

    // Mirror completed_at di response
    if (status === "completed") {
      progress.completed_at = new Date();
    }

    res.json({ success: true, progress });
  } catch (error) {
    console.error("Error updating progress:", error);

    // Tangani error FK
    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Foreign key constraint gagal: pastikan enrollment_id & module_id valid",
      });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getProgressByEnrollment = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const progress = await ProgressModel.findByEnrollment(enrollmentId);
    res.json(progress);
  } catch (error) {
    console.error("Error fetching progress by enrollment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProgressByModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const progress = await ProgressModel.findByModule(moduleId);
    res.json(progress);
  } catch (error) {
    console.error("Error fetching progress by module:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProgressModel.remove(id);

    if (!deleted) {
      return res.status(404).json({ message: "Progress not found" });
    }

    res.json({ message: "Progress deleted successfully", data: deleted });
  } catch (error) {
    console.error("Error deleting progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
