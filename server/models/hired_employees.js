const db = require('../config/db');

const HiredEmployees = {
  insert: (hiredEmployee, callback) => {
    const query = 'insert hired_employees (employee_id, hire_datetime, department_id, job_id) values (?, ?, ?, ?)';
    db.query(query, [hiredEmployee.employee_id, hiredEmployee.hire_datetime, hiredEmployee.department_id, hiredEmployee.job_id], callback);
  },
  getAll: (callback) => {
    db.query('select he.employee_id, he.hire_datetime, he.department_id, he.job_id from hired_employees he', callback);
  },
  getHiredByQuarter2021: (callback) => {
    const query = `
      select d.name, j.name,
        sum(case when quarter(he.hire_datetime) = 1 then 1 else 0 end) as q1,
        sum(case when quarter(he.hire_datetime) = 2 then 1 else 0 end) as q2,
        sum(case when quarter(he.hire_datetime) = 3 then 1 else 0 end) as q3,
        sum(case when quarter(he.hire_datetime) = 4 then 1 else 0 end) as q4
      from hired_employees he
      join department d on he.department_id = d.id
      join job j on he.job_id = j.id
      where year(he.hire_datetime) = 2021
      group by d.name, j.job
      order by d.name, j.job;
    `;
    db.query(query, callback);
  },
  getDepartmentsAboveMeanHires2021: (callback) => {
    const query = `
      select d.id, d.name, count(he.employee_id) as hired
      from hired_employees he
      join department d on he.department_id = d.id
      where year(he.hire_datetime) = 2021
      group by d.id, d.name
      having hired > (
        select avg(hired_count) from (
          select count(employee_id) as hired_count
          from hired_employees
          where year(hire_datetime) = 2021
          group by department_id
        ) as subquery
      )
      order by hired desc;
    `;
    db.query(query, callback);
  }
};

module.exports = HiredEmployees;
