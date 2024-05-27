
create database data_challenge_db;

use data_challenge_db;

create table department (
  id int primary key auto_increment,
  name varchar(50) not null
);

create table job (
  id int primary key auto_increment,
  name varchar(50) not null
);

create table employee (
  id int primary key auto_increment,
  name varchar(50) not null,
  hire_datetime datetime not null,
  department_id int,
  job_id int,
  foreign key (department_id) references department(id),
  foreign key (job_id) references job(id)
);
