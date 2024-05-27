const mysql = require('mysql');
const config = require('./config');

const connection = mysql.createConnection(config.db);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the database');
});

module.exports = connection;
