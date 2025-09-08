import pool from "../config/database.js"

export const UserModel = {
  // Create User
  async create({ name, email, password, role = "student" }) {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, role, created_at`,
      [name, email, password, role]
    );
    return result.rows[0];
  },

  // Get all users
  async findAll() {
    const result = await pool.query(
      `SELECT id, name, email, role, created_at, updated_at FROM users`
    );
    return result.rows;
  },

  // Get user by ID
  async findById(id) {
    const result = await pool.query(
      `SELECT id, name, email, role, created_at, updated_at 
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Get user by email (buat login)
  async findByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  },

  // Update user
  async update(id, fields) {
    const setClauses = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        setClauses.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }

    if (setClauses.length === 0) {
      return null; 
    }

    values.push(id);
    const query = `
      UPDATE users 
      SET ${setClauses.join(", ")}, updated_at = NOW()
      WHERE id = $${index}
      RETURNING id, name, email, role, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Delete user
  async remove(id) {
    await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    return { message: "User deleted successfully" };
  },
};
