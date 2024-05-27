const db = require('../config/db');

const Employee = {
  insert: (employee, callback) => {
    const query = 'insert into employee (name) values (?)';
    db.query(query, [employee.name], callback);
  },
  getAll: (callback) => {
    db.query('select e.id, e.name from employee e', callback);
  }
};

module.exports = Employee;
