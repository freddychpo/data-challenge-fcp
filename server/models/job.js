const db = require('../config/db');

const Job = {
  insert: (job, callback) => {
    const query = 'insert job (name) values (?)';
    db.query(query, [job.name], callback);
  },
  getAll: (callback) => {
    db.query('select j.id, j.name from job j', callback);
  }
};

module.exports = Job;
