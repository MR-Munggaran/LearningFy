import { LessonModel } from "../models/Lesson.js";
import fs from "fs";
import path from "path";

export const listLessonFromModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const lessons = await LessonModel.findByModule(moduleId);

    // Format resource_url jadi URL publik
    const formatted = lessons.map((lesson) => {
      let fileUrl = lesson.resource_url;

      if (fileUrl && !fileUrl.startsWith("http")) {
        if (fileUrl.includes("docs")) {
          fileUrl = `${req.protocol}://${req.get("host")}/uploads/docs/${fileUrl.split("/").pop()}`;
        } else {
          fileUrl = `${req.protocol}://${req.get("host")}/uploads/${fileUrl.split("/").pop()}`;
        }
      }

      return {
        ...lesson,
        resource_url: fileUrl,
      };
    });

    return res.json({ success: true, lessons: formatted }); // bisa [] kalau kosong
  } catch (error) {
    console.error("Error listing lessons:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createLesson = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, content, content_type, resource_url, position } = req.body;

    if (!title || !position || !content_type) {
      return res.status(400).json({
        message: "Title, position, and content_type are required",
      });
    }

    // Default pakai body (misal link YouTube)
    let fileUrl = resource_url;

    // Kalau ada file upload
    if (req.file) {
      if (req.file.mimetype === "application/pdf") {
        fileUrl = `${req.protocol}://${req.get("host")}/uploads/docs/${req.file.filename}`;
      } else {
        fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      }
    }

    const newLesson = await LessonModel.create({
      module_id: moduleId,
      title,
      content,
      content_type,
      resource_url: fileUrl,
      position,
    });

    return res.status(201).json({ success: true, newLesson });
  } catch (error) {
    console.error("Error creating lesson:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, content_type, resource_url, position } = req.body;

    const existing = await LessonModel.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    let fileUrl = resource_url ?? existing.resource_url;

    if (req.file) {
      if (req.file.mimetype === "application/pdf") {
        fileUrl = `${req.protocol}://${req.get("host")}/uploads/docs/${req.file.filename}`;
      } else {
        fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      }
    }

    const updatedLesson = await LessonModel.update(id, {
      title: title ?? existing.title,
      content: content ?? existing.content,
      content_type: content_type ?? existing.content_type,
      resource_url: fileUrl,
      position: position ?? existing.position,
    });

    return res.json({ success: true, updatedLesson });
  } catch (error) {
    console.error("Error updating lesson:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await LessonModel.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if(existing.resource_url && !existing.resource_url.startsWith("http")){
      const filename = path.basename(existing.resource_url);
      const filePath = path.join("utils/upload/docs", filename);
      if(fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await LessonModel.remove(id);
    return res.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
