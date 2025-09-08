import pool from "../config/database.js"

export const TagModel = {
  // Create new tag
  async create({ name }) {
    const result = await pool.query(
      `INSERT INTO tags (name)
       VALUES ($1)
       RETURNING id, name, created_at, updated_at`,
      [name]
    );
    return result.rows[0];
  },

  // Get all tags
  async findAll() {
    const result = await pool.query(
      `SELECT id, name, created_at, updated_at
       FROM tags
       ORDER BY created_at DESC`
    );
    return result.rows;
  },

  // Get single tag by ID
  async findById(id) {
    const result = await pool.query(
      `SELECT id, name, created_at, updated_at
       FROM tags
       WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Update tag
  async update(id, { name }) {
    const result = await pool.query(
      `UPDATE tags
       SET name = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, name, created_at, updated_at`,
      [name, id]
    );
    return result.rows[0];
  },

  // Delete tag
  async remove(id) {
    await pool.query(`DELETE FROM tags WHERE id = $1`, [id]);
    return { message: "Tag deleted successfully" };
  },

  // Assign tag to a course
  async addTagToCourse(course_id, tag_id) {
    const result = await pool.query(
      `INSERT INTO course_tags (course_id, tag_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING
       RETURNING course_id, tag_id`,
      [course_id, tag_id]
    );
    return result.rows[0];
  },

  // Remove tag from a course
  async removeTagFromCourse(course_id, tag_id) {
    await pool.query(
      `DELETE FROM course_tags WHERE course_id = $1 AND tag_id = $2`,
      [course_id, tag_id]
    );
    return { message: "Tag removed from course" };
  },

  // Get tags for a course
  async findTagsByCourse(course_id) {
    const result = await pool.query(
      `SELECT t.id, t.name
       FROM tags t
       INNER JOIN course_tags ct ON ct.tag_id = t.id
       WHERE ct.course_id = $1`,
      [course_id]
    );
    return result.rows;
  },
};
