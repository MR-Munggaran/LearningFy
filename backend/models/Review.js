import pool from "../config/database.js";

export const ReviewModel = {
  async create({ user_id, course_id, rating, comment }) {
    try {
      const result = await pool.query(
        `INSERT INTO reviews (user_id, course_id, rating, comment)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [user_id, course_id, rating, comment]
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === "23505") {
        throw new Error("User sudah memberi review untuk kursus ini");
      }
      throw error;
    }
  },

  async findByCourse(course_id) {
    const result = await pool.query(
      `SELECT r.*, u.name AS user_name 
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.course_id = $1
       ORDER BY r.created_at DESC`,
      [course_id]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM reviews WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async update({ id, rating, comment }) {
    const result = await pool.query(
      `UPDATE reviews
       SET rating = $1,
           comment = $2
       WHERE id = $3
       RETURNING *`,
      [rating, comment, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM reviews WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }
};
