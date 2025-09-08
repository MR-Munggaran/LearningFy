import { ModuleModel } from "../models/Module.js";

export const listModuleFromCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const modules = await ModuleModel.findByCourse(courseId);

    return res.json({ success: true, modules }); // bisa [] kalau kosong
  } catch (error) {
    console.error("Error listing modules:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createModule = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, position } = req.body;

    if (!title || !position) {
      return res.status(400).json({ message: "Title and position are required" });
    }

    const newModule = await ModuleModel.create({
      course_id: courseId,
      title,
      description,
      position,
    });

    return res.status(201).json({ success: true, newModule });
  } catch (error) {
    console.error("Error creating module:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, position } = req.body;

    const existing = await ModuleModel.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Module not found" });
    }

    const updatedModule = await ModuleModel.update(id, {
      title: title ?? existing.title,
      description: description ?? existing.description,
      position: position ?? existing.position,
    });

    return res.json(updatedModule);
  } catch (error) {
    console.error("Error updating module:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await ModuleModel.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Module not found" });
    }

    await ModuleModel.remove(id);
    return res.json({ message: "Module deleted successfully" });
  } catch (error) {
    console.error("Error deleting module:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};