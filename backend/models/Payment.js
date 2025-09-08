import pool from "../config/database.js";

export const PaymentModel = {
  // Create payment record
  async create({ enrollment_id, order_id, amount, status = "pending", payment_type }) {
    const result = await pool.query(
      `INSERT INTO payments (enrollment_id, order_id, amount, status, payment_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, enrollment_id, order_id, amount, status, payment_type, transaction_time`,
      [enrollment_id, order_id, amount, status, payment_type]
    );
    return result.rows[0];
  },

  // Get payment by id
  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM payments WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Get payment by order_id
  async findByOrderId(order_id) {
    const result = await pool.query(
      `SELECT * FROM payments WHERE order_id = $1`,
      [order_id]
    );
    return result.rows[0];
  },

  async getCoursePriceByEnrollment(enrollment_id) {
    const result = await pool.query(
      `SELECT c.price 
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.id = $1`,
      [enrollment_id]
    );
    return result.rows[0]?.price || null;
  },

  // Update payment status
  async updateStatus(order_id, status, payment_type = null) {
    const result = await pool.query(
      `UPDATE payments
       SET status = $1, payment_type = COALESCE($3, payment_type), transaction_time = NOW()
       WHERE order_id = $2
       RETURNING *`,
      [status, order_id, payment_type]
    );
    return result.rows[0];
  },

  // Delete payment
  async remove(id) {
    await pool.query(`DELETE FROM payments WHERE id = $1`, [id]);
    return { message: "Payment deleted successfully" };
  }
};
