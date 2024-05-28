const db = require('../config/db');

const Employee = {
  insert: (employee, callback) => {
   // Convert date string to JavaScript date object
   const hireDate = new Date(employee.hire_datetime);

   // Get the date format required by MySQL (YYYYY-MM-DD HH:MM:SS)
   const formattedHireDate = hireDate.toISOString().slice(0, 19).replace('T', ' ');

   const query = 'insert into employee (name, hire_datetime, department_id, job_id) values (?, ?, ?, ?)';
   db.query(query, [employee.name, formattedHireDate, employee.department_id, employee.job_id], (err, result) => {
     if (err) {
       console.error('Error inserting employee:', err);
       return callback(err);
     }

      callback(null, result);
    });
  },
  getAll: (callback) => {
    db.query('select e.id, e.name, e.hire_datetime, e.department_id, e.job_id from employee e', callback);
  },
  getHiredByQuarter2021: (callback) => {
    const query = `
      select d.name, j.name,
        sum(case when quarter(e.hire_datetime) = 1 then 1 else 0 end) as q1,
        sum(case when quarter(e.hire_datetime) = 2 then 1 else 0 end) as q2,
        sum(case when quarter(e.hire_datetime) = 3 then 1 else 0 end) as q3,
        sum(case when quarter(e.hire_datetime) = 4 then 1 else 0 end) as q4
      from employee e
      join department d on e.department_id = d.id
      join job j on e.job_id = j.id
      where year(e.hire_datetime) = 2021
      group by d.name, j.job
      order by d.name, j.job;
    `;
    db.query(query, callback);
  },
  getDepartmentsAboveMeanHires2021: (callback) => {
    const query = `
      select d.id, d.name, count(e.id) as hired
      from employee e
      join department d on e.department_id = d.id
      where year(e.hire_datetime) = 2021
      group by d.id, d.name
      having hired > (
        select avg(hired_count) from (
          select count(id) as hired_count
          from employee
          where year(hire_datetime) = 2021
          group by department_id
        ) as subquery
      )
      order by hired desc;
    `;
    db.query(query, callback);
  }
};

module.exports = Employee;
