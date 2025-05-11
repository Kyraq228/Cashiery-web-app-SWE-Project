module.exports = {
  GET_PRODUCT_BY_ID: 'SELECT * FROM products WHERE id = $1',
  GET_USER_BY_USERNAME: 'SELECT * FROM users WHERE username = $1',
  INSERT_TRANSACTION: `
    INSERT INTO transactions (cashier_id, total)
    VALUES ($1, $2)
    RETURNING *
  `,
};