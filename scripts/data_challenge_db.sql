
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
  name varchar(50) null,
  hire_datetime datetime null,
  department_id int,
  job_id int,
  foreign key (department_id) references department(id),
  foreign key (job_id) references job(id)
);
