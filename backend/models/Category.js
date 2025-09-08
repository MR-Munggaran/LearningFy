import pool from "../config/database.js"

export const CategoryModel = {
  // Create Category
  async create({ name, description }) {
    const result = await pool.query(
      `INSERT INTO categories (name, description) 
       VALUES ($1, $2) 
       RETURNING id, name, description, created_at`,
      [name, description]
    );
    return result.rows[0];
  },

  // Get all categories
  async findAll() {
    const result = await pool.query(
      `SELECT id, name, description, created_at, updated_at FROM categories`
    );
    return result.rows;
  },

  // Get category by ID
  async findById(id) {
    const result = await pool.query(
      `SELECT id, name, description, created_at, updated_at 
       FROM categories WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Update category
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

    if (setClauses.length === 0) return null;

    values.push(id); // terakhir buat WHERE
    const query = `
      UPDATE categories 
      SET ${setClauses.join(", ")}, updated_at = NOW()
      WHERE id = $${index}
      RETURNING id, name, description, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Delete category
  async remove(id) {
    await pool.query(`DELETE FROM categories WHERE id = $1`, [id]);
    return { message: "Category deleted successfully" };
  },
};
