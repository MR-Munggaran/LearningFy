import pool from "../config/database.js"

export const CourseModel = {
  // Create course
  async create({ title, description, category_id, instructor_id, price, image }) {
    const result = await pool.query(
      `INSERT INTO courses (title, description, category_id, instructor_id, price, image) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, description, category_id, instructor_id, price, image, created_at`,
      [title, description, category_id, instructor_id, price, image]
    );
    return result.rows[0];
  },

  // Get all courses
  async findAll() {
    const result = await pool.query(
      `SELECT 
          c.id, 
          c.title, 
          c.description, 
          c.price, 
          c.image,               -- ambil kolom image
          c.created_at, 
          c.updated_at,
          cat.name AS category_name,
          u.name AS instructor_name
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.instructor_id = u.id`
    );
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT 
          c.id, 
          c.title, 
          c.description, 
          c.price, 
          c.image,               -- tambahkan kolom image
          c.created_at, 
          c.updated_at,
          cat.name AS category_name,
          u.name AS instructor_name
      FROM courses c
      LEFT JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.id = $1`,
      [id]
    );
    return result.rows[0];
  },


  // Update course
  async update(id, { title, description, category_id, price, image }) {
    const result = await pool.query(
      `UPDATE courses
      SET title = $1, description = $2, category_id = $3, price = $4, image = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING id, title, description, category_id, price, image, updated_at`,
      [title, description, category_id, price, image, id]
    );
    return result.rows[0];
  },

  // Delete course
  async remove(id) {
    await pool.query(`DELETE FROM courses WHERE id = $1`, [id]);
    return { message: "Course deleted successfully" };
  },
};
