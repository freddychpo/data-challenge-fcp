const db = require('../config/db');

const Department = {
  insert: (department, callback) => {
    const query = 'insert department (name) values (?)';
    db.query(query, [department.name], callback);
  },
  getAll: (callback) => {
    db.query('select d.id, d.name from department d', callback);
  }
};

module.exports = Department;
