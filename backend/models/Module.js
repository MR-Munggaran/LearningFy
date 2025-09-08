import pool from "../config/database.js";

export const ModuleModel = {
  // Create module
  async create({ course_id, title, description, position }) {
    const result = await pool.query(
      `INSERT INTO modules (course_id, title, description, position)
       VALUES ($1, $2, $3, $4)
       RETURNING id, course_id, title, description, position`,
      [course_id, title, description, position]
    );
    return result.rows[0];
  },

  // Get all modules by course
  async findByCourse(course_id) {
    const result = await pool.query(
      `SELECT id, course_id, title, description, position
       FROM modules
       WHERE course_id = $1
       ORDER BY position ASC`,
      [course_id]
    );
    return result.rows;
  },

  // Get single module
  async findById(id) {
    const result = await pool.query(
      `SELECT id, course_id, title, description, position
       FROM modules
       WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Update module
  async update(id, { title, description, position }) {
    const result = await pool.query(
      `UPDATE modules
       SET title = $1, description = $2, position = $3
       WHERE id = $4
       RETURNING id, course_id, title, description, position`,
      [title, description, position, id]
    );
    return result.rows[0];
  },

  // Delete module
  async remove(id) {
    await pool.query(`DELETE FROM modules WHERE id = $1`, [id]);
    return { message: "Module deleted successfully" };
  },
};
