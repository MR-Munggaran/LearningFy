import pool from "../config/database.js";

export const LessonModel = {
  // Create lesson
  async create({ module_id, title, content, content_type, resource_url, position }) {
    const result = await pool.query(
      `INSERT INTO lessons (module_id, title, content, content_type, resource_url, position)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, module_id, title, content, content_type, resource_url, position`,
      [module_id, title, content, content_type, resource_url, position]
    );
    return result.rows[0];
  },

  // Get all lessons by module
  async findByModule(module_id) {
    const result = await pool.query(
      `SELECT id, module_id, title, content, content_type, resource_url, position
       FROM lessons
       WHERE module_id = $1
       ORDER BY position ASC`,
      [module_id]
    );
    return result.rows;
  },

  // Get single lesson
  async findById(id) {
    const result = await pool.query(
      `SELECT id, module_id, title, content, content_type, resource_url, position
       FROM lessons
       WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Update lesson
  async update(id, { title, content, content_type, resource_url, position }) {
    const result = await pool.query(
      `UPDATE lessons
       SET title = $1, content = $2, content_type = $3, resource_url = $4, position = $5
       WHERE id = $6
       RETURNING id, module_id, title, content, content_type, resource_url, position`,
      [title, content, content_type, resource_url, position, id]
    );
    return result.rows[0];
  },

  // Delete lesson
  async remove(id) {
    await pool.query(`DELETE FROM lessons WHERE id = $1`, [id]);
    return { message: "Lesson deleted successfully" };
  },
};
