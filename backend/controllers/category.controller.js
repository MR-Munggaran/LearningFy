import { CategoryModel } from "../models/Category.js"
import { TagModel } from "../models/Tag.js";

export const categoryList = async (req,res) => {
    try {
        const category = await CategoryModel.findAll();
        res.status(200).json({success: true, category});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.log("Error in categoryList controller", error);
    }
}

export const createCategory = async (req,res) => {
      try {
        const { name, description } = req.body;

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }
    
        if (!name || !description) {
          return res
            .status(400)
            .json({ success: false, message: "All fields are required" });
        }

        const newCategory = await CategoryModel.create({
          name,
          description
        });
    
        return res.status(201).json({
          success: true,
          category: {
            id: newCategory.id,
            name: newCategory.name,
            description: newCategory.description,
          },
        });
      } catch (error) {
        console.log("Error in createCategory controller", error.message);
        res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
      }  
}

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (!name && !description) {
      return res.status(400).json({
        success: false,
        message: "At least one field (name or description) must be provided",
      });
    }

    const fieldsToUpdate = {};
    if (name !== undefined) fieldsToUpdate.name = name;
    if (description !== undefined) fieldsToUpdate.description = description;

    const updatedCategory = await CategoryModel.update(id, fieldsToUpdate);

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, category: updatedCategory });
  } catch (error) {
    console.error("Error in updateCategory controller:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteCategory = async (req,res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await CategoryModel.remove(id);
        res.status(200).json({ success: true, message: "Category deleted successfully" });
        } catch (error) {
        console.log("Error in deleteCategory controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const tagList = async (req,res) => {
    try {
    const tags = await TagModel.findAll();
    res.status(200).json({success: true, tags});
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.log("Error in categoryList controller", error);
    }
}

export const createTag = async (req,res) => {
    try {
        const { name } = req.body;

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }
    
        if ( !name ) {
          return res
            .status(400)
            .json({ success: false, message: "field name is required" });
        }

        const newTag = await TagModel.create({name});
    
        return res.status(201).json({
          success: true,
          Tag: {
            id: newTag.id,
            name: newTag.name,
          },
        });
      } catch (error) {
        console.log("Error in createTag controller", error.message);
        res.status(500).json({
          success: false,
          message: "Internal Server Error",
        });
    }  
}

export const deleteTag = async (req,res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await TagModel.remove(id);
        res.status(200).json({ success: true, message: "Tag deleted successfully" });

        } catch (error) {
        console.log("Error in deleteTag controller", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const addTagToCourse = async (req, res) => {
  try {
    const { course_id, tag_id } = req.body;

    if (!course_id || !tag_id) {
      return res.status(400).json({ success: false, message: "course_id dan tag_id wajib diisi" });
    }

    const newTag = await TagModel.addTagToCourse(course_id, tag_id);

    return res.status(201).json({
      success: true,
      data: newTag,
    });
  } catch (error) {
    console.error("Error in addTagToCourse controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const removeTagFromCourse = async (req, res) => {
  try {
    const { course_id, tag_id } = req.body;

    if (!course_id || !tag_id) {
      return res.status(400).json({ success: false, message: "course_id dan tag_id wajib diisi" });
    }

    const result = await TagModel.removeTagFromCourse(course_id, tag_id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Error in removeTagFromCourse controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getTagsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId wajib diisi" });
    }

    const tags = await TagModel.findTagsByCourse(courseId);

    return res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error("Error in getTagsByCourse controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

