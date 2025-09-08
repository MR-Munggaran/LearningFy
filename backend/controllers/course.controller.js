import fs from "fs";
import path from "path";
import { CourseModel } from "../models/Course.js";

export const courseList = async (req, res) => {
  try {
    const { category, instructor } = req.query;

    let courses = await CourseModel.findAll();

    // Filter kategori jika ada query
    if (category) {
      courses = courses.filter(c => 
        c.category_name?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter instructor jika ada query
    if (instructor) {
      courses = courses.filter(c => 
        c.instructor_name?.toLowerCase().includes(instructor.toLowerCase())
      );
    }

    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.log("Error in courseList controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const detailCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await CourseModel.findById(id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    console.log("Error in detailCourse controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, category_id, price } = req.body;
    const instructor_id = req.user?.id; // ambil dari JWT/Session
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description || !category_id || !instructor_id) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newCourse = await CourseModel.create({
      title,
      description,
      category_id,
      instructor_id,
      price,
      image, // simpan path gambar
    });

    res.status(201).json({ success: true, course: newCourse });
  } catch (error) {
    console.log("Error in createCourse controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category_id, price } = req.body;

    // cek course lama
    const existing = await CourseModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    let finalImage = existing.image; 

    if (req.file) {
      if (existing.image && !existing.image.startsWith("http")) {
        const oldFilename = path.basename(existing.image); 
        const oldPath = path.resolve("utils/upload/images", oldFilename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      finalImage = `/uploads/${req.file.filename}`;
    }

    // update course
    const updated = await CourseModel.update(id, {
      title: title ?? existing.title,
      description: description ?? existing.description,
      category_id: category_id ?? existing.category_id,
      price: price ?? existing.price,
      image: finalImage,
    });

    res.status(200).json({ success: true, course: updated });
  } catch (error) {
    console.error("Error in updateCourse controller:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await CourseModel.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    await CourseModel.remove(id);

    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.log("Error in deleteCourse controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
