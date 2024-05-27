
create database data_challenge_db;

use data_challenge_db;

create table department (
  id int primary key auto_increment,
  name varchar(255) not null
);

create table job (
  id int primary key auto_increment,
  name varchar(255) not null
);

create table employee (
  id int primary key auto_increment,
  name varchar(255) not null
);

create table hired_employees (
  id int primary key auto_increment,
  employee_id int,
  hire_datetime datetime not null,
  department_id int,
  job_id int,
  foreign key (employee_id) references employee(id),
  foreign key (department_id) references department(id),
  foreign key (job_id) references job(id)
);
