import pool from "../config/database.js";

export const ProgressModel = {
  // Cek apakah progress sudah ada
  async findOne(enrollment_id, module_id) {
    const result = await pool.query(
      `SELECT * FROM progress WHERE enrollment_id = $1 AND module_id = $2`,
      [enrollment_id, module_id]
    );
    return result.rows[0];
  },

  // Insert progress baru
  async create({ enrollment_id, module_id, status }) {
    const result = await pool.query(
      `INSERT INTO progress (enrollment_id, module_id, status, completed_at)
       VALUES ($1, $2, $3, CASE WHEN $4 = 'completed' THEN NOW() ELSE NULL END)
       RETURNING *`,
      [enrollment_id, module_id, status, status]
    );
    return result.rows[0];
  },

  // Update progress existing
  async update({ enrollment_id, module_id, status }) {
    const result = await pool.query(
      `UPDATE progress
       SET status = $1,
           completed_at = CASE WHEN $4 = 'completed' THEN NOW() ELSE NULL END
       WHERE enrollment_id = $2 AND module_id = $3
       RETURNING *`,
      [status, enrollment_id, module_id, status] // $4 khusus buat CASE
    );
    return result.rows[0];
  },

  // Get all progress by enrollment (per course → module level)
  async findByEnrollment(enrollment_id) {
    const result = await pool.query(
      `SELECT p.*, m.title AS module_title
       FROM progress p
       JOIN modules m ON p.module_id = m.id
       WHERE p.enrollment_id = $1
       ORDER BY m.id ASC`,
      [enrollment_id]
    );
    return result.rows;
  },

  // Get all progress by module
  async findByModule(module_id) {
    const result = await pool.query(
      `SELECT p.*, e.user_id
       FROM progress p
       JOIN enrollments e ON p.enrollment_id = e.id
       WHERE p.module_id = $1`,
      [module_id]
    );
    return result.rows;
  },

  async remove(id) {
    const result = await pool.query(
      `DELETE FROM progress WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  // Validasi module_id
  async validateModule(module_id) {
    const result = await pool.query(`SELECT id FROM modules WHERE id = $1`, [module_id]);
    return result.rows.length > 0;
  },

  // Validasi enrollment_id
  async validateEnrollment(enrollment_id) {
    const result = await pool.query(`SELECT id FROM enrollments WHERE id = $1`, [enrollment_id]);
    return result.rows.length > 0;
  },
};
