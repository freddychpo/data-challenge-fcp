require('dotenv').config();

const clearDBUrl = process.env.CLEARDB_DATABASE_URL || '';

const dbUrl = new URL(clearDBUrl);

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    host: dbUrl.hostname || process.env.DB_HOST,
    user: dbUrl.username || process.env.DB_USER,
    password: dbUrl.password || process.env.DB_PASSWORD,
    database: dbUrl.pathname.replace('/', '') || process.env.DB_NAME
  }
};
