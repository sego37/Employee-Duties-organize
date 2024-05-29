-- -- Drop the existing department table
-- DROP TABLE IF EXISTS department CASCADE;

-- -- Create the department table
-- CREATE TABLE department (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(255) UNIQUE NOT NULL
-- );

-- -- Drop the existing role table
-- DROP TABLE IF EXISTS role CASCADE;

-- -- Create the role table
-- CREATE TABLE role (
--     id SERIAL PRIMARY KEY,
--     title VARCHAR(30) UNIQUE NOT NULL,
--     salary DECIMAL NOT NULL,
--     department_id INTEGER NOT NULL,
--     FOREIGN KEY (department_id) REFERENCES department(id)
-- );

-- -- Drop the existing employee table
-- DROP TABLE IF EXISTS employee CASCADE;

-- -- Create the employee table
-- CREATE TABLE employee (
--     id SERIAL PRIMARY KEY,
--     first_name VARCHAR(30) NOT NULL,
--     last_name VARCHAR(30) NOT NULL,
--     role_id INTEGER NOT NULL,
--     manager_id INTEGER,
--     department_id INTEGER NOT NULL,
--     salary DECIMAL NOT NULL,
--     FOREIGN KEY (role_id) REFERENCES role(id),
--     FOREIGN KEY (manager_id) REFERENCES employee(id),
--     FOREIGN KEY (department_id) REFERENCES department(id)
-- );

-- -- Create a view to get all employees with additional details
-- CREATE VIEW all_employees AS
-- SELECT e.id AS employee_id, 
--        e.first_name, 
--        e.last_name, 
--        r.title AS job_title, 
--        d.name AS department, 
--        r.salary, 
--        CONCAT(m.first_name, ' ', m.last_name) AS manager_name
-- FROM employee e
-- INNER JOIN role r ON e.role_id = r.id
-- INNER JOIN department d ON r.department_id = d.id
-- LEFT JOIN employee m ON e.manager_id = m.id;

-- CREATE DATABASE orgflow_db;

-- \c orgflow_db

-- Drop the existing department table
DROP TABLE IF EXISTS department;

-- Create the department table with only id and name columns
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

-- Drop the existing role table
DROP TABLE IF EXISTS role;

-- Create the role table with id, title, department, and salary columns
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Drop the existing employee table
DROP TABLE IF EXISTS employee;

-- Create the employee table with id, first_name, last_name, role_id, manager_id, and department_id columns
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    department_id INTEGER NOT NULL,
    salary DECIMAL NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create a view to get all employees with additional details
CREATE VIEW all_employees AS
SELECT e.id AS employee_id, 
       e.first_name, 
       e.last_name, 
       r.title AS job_title, 
       d.name AS department, 
       r.salary, 
       CONCAT(m.first_name, ' ', m.last_name) AS manager_name
FROM employee e
INNER JOIN role r ON e.role_id = r.id
INNER JOIN department d ON r.department_id = d.id
LEFT JOIN employee m ON e.manager_id = m.id;

SELECT 
    role.id,
    role.title,
    role.salary,
    department.name AS department_name
FROM 
    role
JOIN 
    department ON role.department_id = department.id;

-- Drop dependent objects
DROP VIEW IF EXISTS all_employees;
-- Drop constraints
ALTER TABLE role DROP CONSTRAINT IF EXISTS role_department_id_fkey;
ALTER TABLE employee DROP CONSTRAINT IF EXISTS employee_department_id_fkey;
-- Drop the department table
DROP TABLE IF EXISTS department CASCADE;

-- Create the department table
CREATE TABLE IF NOT EXISTS department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
