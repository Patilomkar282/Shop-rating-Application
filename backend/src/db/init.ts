import pool from '../config/db.js';

export const initDB = async () => {
  try {
    console.log('Initializing database tables...');

    // 1. Create Users Table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        address VARCHAR(400),
        role ENUM('ADMIN', 'USER', 'STORE_OWNER') DEFAULT 'USER',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    // 2. Create Stores Table
    const createStoresTable = `
      CREATE TABLE IF NOT EXISTS stores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        address VARCHAR(400) NOT NULL,
        owner_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    // 3. Create Ratings Table
    const createRatingsTable = `
      CREATE TABLE IF NOT EXISTS ratings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        store_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_store_rating (user_id, store_id)
      )
    `;

    // Execute queries sequentially to respect foreign key constraints
    await pool.query(createUsersTable);
    console.log('✅ Users table ready');

    await pool.query(createStoresTable);
    console.log('✅ Stores table ready');

    await pool.query(createRatingsTable);
    console.log('✅ Ratings table ready');

    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
};
