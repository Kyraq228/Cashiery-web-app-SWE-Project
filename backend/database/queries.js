module.exports = {
  // User/Authentication Queries
  GET_USER_BY_USERNAME: 'SELECT * FROM users WHERE username = $1',
  GET_USER_BY_ID: 'SELECT * FROM users WHERE id = $1',
  CREATE_USER: `
    INSERT INTO users (username, password_hash, role)
    VALUES ($1, $2, $3)
    RETURNING id, username, role, created_at
  `,
  UPDATE_USER: `
    UPDATE users 
    SET username = $2, password_hash = $3, role = $4, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id, username, role, updated_at
  `,
  DELETE_USER: 'DELETE FROM users WHERE id = $1',

  // Product Queries
  GET_ALL_PRODUCTS: 'SELECT * FROM products ORDER BY name ASC',
  GET_PRODUCT_BY_ID: 'SELECT * FROM products WHERE id = $1',
  GET_PRODUCT_BY_SKU: 'SELECT * FROM products WHERE sku = $1',
  SEARCH_PRODUCTS: `
    SELECT * FROM products 
    WHERE name ILIKE $1 OR sku ILIKE $1 OR description ILIKE $1
    ORDER BY name ASC
  `,
  GET_LOW_STOCK_PRODUCTS: `
    SELECT * FROM products 
    WHERE stock <= $1 
    ORDER BY stock ASC, name ASC
  `,
  CREATE_PRODUCT: `
    INSERT INTO products (name, description, price, stock, sku, category_id, barcode)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `,
  UPDATE_PRODUCT: `
    UPDATE products 
    SET name = $2, description = $3, price = $4, stock = $5, sku = $6, 
        category_id = $7, barcode = $8, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `,
  UPDATE_PRODUCT_STOCK: `
    UPDATE products 
    SET stock = stock + $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `,
  DECREASE_PRODUCT_STOCK: `
    UPDATE products 
    SET stock = stock - $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND stock >= $2
    RETURNING *
  `,
  DELETE_PRODUCT: 'DELETE FROM products WHERE id = $1',
  CHECK_PRODUCT_STOCK: 'SELECT id, name, stock FROM products WHERE id = $1',

  // Category Queries
  GET_ALL_CATEGORIES: 'SELECT * FROM categories ORDER BY name ASC',
  GET_CATEGORY_BY_ID: 'SELECT * FROM categories WHERE id = $1',
  CREATE_CATEGORY: `
    INSERT INTO categories (name, description)
    VALUES ($1, $2)
    RETURNING *
  `,
  UPDATE_CATEGORY: `
    UPDATE categories 
    SET name = $2, description = $3, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `,
  DELETE_CATEGORY: 'DELETE FROM categories WHERE id = $1',

  // Transaction Queries
  GET_ALL_TRANSACTIONS: `
    SELECT t.*, u.username as cashier_name
    FROM transactions t
    JOIN users u ON t.cashier_id = u.id
    ORDER BY t.created_at DESC
  `,
  GET_TRANSACTION_BY_ID: `
    SELECT t.*, u.username as cashier_name
    FROM transactions t
    JOIN users u ON t.cashier_id = u.id
    WHERE t.id = $1
  `,
  GET_TRANSACTIONS_BY_DATE: `
    SELECT t.*, u.username as cashier_name
    FROM transactions t
    JOIN users u ON t.cashier_id = u.id
    WHERE DATE(t.created_at) = $1
    ORDER BY t.created_at DESC
  `,
  GET_TRANSACTIONS_BY_DATE_RANGE: `
    SELECT t.*, u.username as cashier_name
    FROM transactions t
    JOIN users u ON t.cashier_id = u.id
    WHERE t.created_at BETWEEN $1 AND $2
    ORDER BY t.created_at DESC
  `,
  GET_TRANSACTIONS_BY_CASHIER: `
    SELECT t.*, u.username as cashier_name
    FROM transactions t
    JOIN users u ON t.cashier_id = u.id
    WHERE t.cashier_id = $1
    ORDER BY t.created_at DESC
  `,
  CREATE_TRANSACTION: `
    INSERT INTO transactions (cashier_id, total, payment_method, tax_amount, discount_amount, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `,
  UPDATE_TRANSACTION_STATUS: `
    UPDATE transactions 
    SET status = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `,
  DELETE_TRANSACTION: 'DELETE FROM transactions WHERE id = $1',

  // Transaction Items Queries
  GET_TRANSACTION_ITEMS: `
    SELECT ti.*, p.name as product_name, p.sku as product_sku
    FROM transaction_items ti
    JOIN products p ON ti.product_id = p.id
    WHERE ti.transaction_id = $1
    ORDER BY ti.id
  `,
  CREATE_TRANSACTION_ITEM: `
    INSERT INTO transaction_items (transaction_id, product_id, quantity, unit_price, total_price)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `,
  UPDATE_TRANSACTION_ITEM: `
    UPDATE transaction_items
    SET quantity = $3, unit_price = $4, total_price = $5
    WHERE transaction_id = $1 AND product_id = $2
    RETURNING *
  `,
  DELETE_TRANSACTION_ITEM: `
    DELETE FROM transaction_items 
    WHERE transaction_id = $1 AND product_id = $2
  `,
  DELETE_ALL_TRANSACTION_ITEMS: `
    DELETE FROM transaction_items 
    WHERE transaction_id = $1
  `,

  // Sales Summary and Reporting Queries
  GET_DAILY_SALES_SUMMARY: `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as transaction_count,
      SUM(total) as total_sales,
      AVG(total) as average_sale,
      SUM(tax_amount) as total_tax,
      SUM(discount_amount) as total_discounts
    FROM transactions 
    WHERE DATE(created_at) = CURRENT_DATE
    GROUP BY DATE(created_at)
  `,
  GET_SALES_SUMMARY_BY_DATE_RANGE: `
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as transaction_count,
      SUM(total) as total_sales,
      AVG(total) as average_sale,
      SUM(tax_amount) as total_tax,
      SUM(discount_amount) as total_discounts
    FROM transactions 
    WHERE created_at BETWEEN $1 AND $2
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `,
  GET_MONTHLY_SALES_SUMMARY: `
    SELECT 
      EXTRACT(YEAR FROM created_at) as year,
      EXTRACT(MONTH FROM created_at) as month,
      COUNT(*) as transaction_count,
      SUM(total) as total_sales,
      AVG(total) as average_sale
    FROM transactions 
    WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '11 months')
    GROUP BY EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)
    ORDER BY year DESC, month DESC
  `,
  GET_TOP_SELLING_PRODUCTS: `
    SELECT 
      p.id, p.name, p.sku,
      SUM(ti.quantity) as total_quantity_sold,
      SUM(ti.total_price) as total_revenue,
      COUNT(DISTINCT ti.transaction_id) as transaction_count
    FROM products p
    JOIN transaction_items ti ON p.id = ti.product_id
    JOIN transactions t ON ti.transaction_id = t.id
    WHERE t.created_at BETWEEN $1 AND $2
    GROUP BY p.id, p.name, p.sku
    ORDER BY total_quantity_sold DESC
    LIMIT $3
  `,
  GET_CASHIER_PERFORMANCE: `
    SELECT 
      u.id, u.username,
      COUNT(t.id) as transaction_count,
      SUM(t.total) as total_sales,
      AVG(t.total) as average_sale
    FROM users u
    JOIN transactions t ON u.id = t.cashier_id
    WHERE t.created_at BETWEEN $1 AND $2
    GROUP BY u.id, u.username
    ORDER BY total_sales DESC
  `,

  // Inventory Management Queries
  GET_INVENTORY_VALUE: `
    SELECT 
      SUM(stock * price) as total_inventory_value,
      COUNT(*) as total_products,
      SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as out_of_stock_count,
      SUM(CASE WHEN stock <= 5 THEN 1 ELSE 0 END) as low_stock_count
    FROM products
  `,
  GET_PRODUCTS_NEED_RESTOCK: `
    SELECT * FROM products 
    WHERE stock <= reorder_level OR stock = 0
    ORDER BY stock ASC, name ASC
  `,

  // Audit Trail Queries (if you want to track changes)
  CREATE_AUDIT_LOG: `
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values, ip_address)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `,
  GET_AUDIT_LOGS: `
    SELECT al.*, u.username
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC
    LIMIT $1 OFFSET $2
  `,

  // Dashboard/Analytics Queries
  GET_DASHBOARD_STATS: `
    SELECT 
      (SELECT COUNT(*) FROM transactions WHERE DATE(created_at) = CURRENT_DATE) as today_transactions,
      (SELECT COALESCE(SUM(total), 0) FROM transactions WHERE DATE(created_at) = CURRENT_DATE) as today_sales,
      (SELECT COUNT(*) FROM products WHERE stock <= 5) as low_stock_alerts,
      (SELECT COUNT(*) FROM products WHERE stock = 0) as out_of_stock_count,
      (SELECT COUNT(*) FROM products) as total_products,
      (SELECT COUNT(*) FROM users WHERE role = 'cashier') as total_cashiers
  `,

  // Payment Method Queries
  GET_PAYMENT_METHODS: 'SELECT * FROM payment_methods ORDER BY name ASC',
  CREATE_PAYMENT_METHOD: `
    INSERT INTO payment_methods (name, description, is_active)
    VALUES ($1, $2, $3)
    RETURNING *
  `,

  // Customer Queries (if you plan to add customer management)
  GET_ALL_CUSTOMERS: 'SELECT * FROM customers ORDER BY name ASC',
  GET_CUSTOMER_BY_ID: 'SELECT * FROM customers WHERE id = $1',
  CREATE_CUSTOMER: `
    INSERT INTO customers (name, email, phone, address)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,
  UPDATE_CUSTOMER: `
    UPDATE customers 
    SET name = $2, email = $3, phone = $4, address = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `,
  DELETE_CUSTOMER: 'DELETE FROM customers WHERE id = $1'
};