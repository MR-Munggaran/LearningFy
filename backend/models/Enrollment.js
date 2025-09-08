import pool from "../config/database.js"

export const EnrollmentModel = {
  // Enroll dengan auto-status berdasar harga course (0 => active, >0 => pending)
  async enroll({ user_id, course_id }) {
    // Cegah duplikat lebih dulu
    const existing = await this.findByUserAndCourse(user_id, course_id);
    if (existing) return existing;

    const c = await pool.query(
      `SELECT price, instructor_id FROM courses WHERE id = $1`,
      [course_id]
    );
    if (c.rowCount === 0) throw new Error("Course not found");

    const status = Number(c.rows[0].price) === 0 ? "active" : "pending";
    return this.create({ user_id, course_id, status });
  },

  // Create murni (pakai status yang diberikan)
  async create({ user_id, course_id, status = "pending" }) {
    try {
      const res = await pool.query(
        `INSERT INTO enrollments (user_id, course_id, status)
         VALUES ($1, $2, $3)
         RETURNING id, user_id, course_id, status, enrolled_at`,
        [user_id, course_id, status]
      );
      return res.rows[0];
    } catch (err) {
      // 23505 = unique_violation (UNIQUE(user_id, course_id))
      if (err.code === "23505") {
        const existed = await this.findByUserAndCourse(user_id, course_id);
        return existed;
      }
      throw err;
    }
  },

  async findById(id) {
    const res = await pool.query(
      `SELECT e.id, e.user_id, e.course_id, e.status, e.enrolled_at,
              c.title AS course_title, c.price, c.instructor_id,
              u.name  AS instructor_name
       FROM enrollments e
       JOIN courses c   ON c.id = e.course_id
       JOIN users   u   ON u.id = c.instructor_id
       WHERE e.id = $1`,
      [id]
    );
    return res.rows[0];
  },

  async findByUser(user_id) {
    const res = await pool.query(
      `SELECT e.id, e.user_id, e.course_id, e.status, e.enrolled_at,
              c.title AS course_title, c.price, c.instructor_id,
              u.name  AS instructor_name
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       JOIN users   u ON u.id = c.instructor_id
       WHERE e.user_id = $1
       ORDER BY e.enrolled_at DESC`,
      [user_id]
    );
    return res.rows;
  },

  async findByCourse(course_id) {
    const res = await pool.query(
      `SELECT e.id, e.user_id, e.course_id, e.status, e.enrolled_at,
              su.name AS student_name, su.email AS student_email
       FROM enrollments e
       JOIN users su ON su.id = e.user_id
       WHERE e.course_id = $1
       ORDER BY e.enrolled_at DESC`,
      [course_id]
    );
    return res.rows;
  },

  async findByUserAndCourse(user_id, course_id) {
    const res = await pool.query(
      `SELECT id, user_id, course_id, status, enrolled_at
       FROM enrollments
       WHERE user_id = $1 AND course_id = $2`,
      [user_id, course_id]
    );
    return res.rows[0];
  },

  async isEnrolled(user_id, course_id) {
    const res = await pool.query(
      `SELECT 1 FROM enrollments WHERE user_id = $1 AND course_id = $2`,
      [user_id, course_id]
    );
    return res.rowCount > 0;
  },

  async updateStatus(id, status) {
    const res = await pool.query(
      `UPDATE enrollments
      SET status = $1::VARCHAR, 
          enrolled_at = CASE WHEN $1::VARCHAR = 'active' THEN NOW() ELSE enrolled_at END
      WHERE id = $2
      RETURNING id, user_id, course_id, status, enrolled_at`,
      [status, id]
    );
    return res.rows[0];
  },


  async cancel(id) {
    return this.updateStatus(id, "cancelled");
  },

  async remove(id) {
    await pool.query(`DELETE FROM enrollments WHERE id = $1`, [id]);
    return { message: "Enrollment deleted successfully" };
  },

  async countByCourse(course_id) {
    const res = await pool.query(
      `SELECT COUNT(*)::int AS total FROM enrollments WHERE course_id = $1 AND status = 'active'`,
      [course_id]
    );
    return res.rows[0].total;
  },
};
