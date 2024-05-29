// utils/queries.js

const pool = require('../config/db');

// Function to get all departments from the database
async function getAllDepartments() {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM department'); // Correct table name here
        console.log(result)
        return result.rows;
    } finally {
        client.release();
    }
}

// Function to get all roles from the database
async function getAllRoles() {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT role.id, role.title, role.salary, department.name AS department_name
            FROM role
            JOIN department ON role.department_id = department.id
        `);
        return result.rows;
    } finally {
        client.release();
    }
}


// Function to get all employees from the database
async function getAllEmployees() {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT 
                employee.id AS employee_id,
                employee.first_name,
                employee.last_name,
                department.name AS department,
                role.title AS job_title,
                role.salary,
                CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
            FROM 
                employee
                JOIN role ON employee.role_id = role.id
                JOIN department ON role.department_id = department.id
                LEFT JOIN employee AS manager ON employee.manager_id = manager.id
        `);
        return result.rows;
    } finally {
        client.release();
    }
}

// Function to insert a new department into the database
async function insertDepartment(departmentName) {
    const client = await pool.connect();
    try {
        await client.query('INSERT INTO department (name) VALUES ($1)', [departmentName]);
    } finally {
        client.release();
    }
}
// Function to insert a new role into the database
async function insertRole(roleName, salary, departmentId) {
    const client = await pool.connect();
    try {
        const query = `
            INSERT INTO role (title, salary, department_id)
            VALUES ($1, $2, $3)
        `;
        await client.query(query, [roleName, salary, departmentId]);
        console.log(`Role "${roleName}" added successfully!`);
    } catch (error) {
        console.error('Error adding role:', error);
        throw error; // Re-throw the error to handle it outside this function
    } finally {
        client.release();
    }
}

async function insertEmployee(firstName, lastName, roleId, managerId, departmentId) {
    const client = await pool.connect();
    try {
        // Retrieve the salary for the selected role
        const role = await client.query('SELECT salary FROM role WHERE id = $1', [roleId]);
        const salary = role.rows[0].salary;

        const query = `
            INSERT INTO employee (first_name, last_name, role_id, manager_id, department_id, salary)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        await client.query(query, [firstName, lastName, roleId, managerId, departmentId, salary]);
        console.log('Employee added successfully!');
    } catch (error) {
        console.error('Error inserting employee:', error);
        throw error; // Re-throw the error to handle it outside this function
    } finally {
        client.release();
    }
}

// Function to update an employee's role in the database
async function updateEmployeeRole(employeeId, roleId) {
    const client = await pool.connect();
    try {
        const query = `
            UPDATE employee
            SET role_id = $1
            WHERE id = $2
        `;
        await client.query(query, [roleId, employeeId]);
        console.log('Employee role updated successfully!');
    } catch (error) {
        console.error('Error updating employee role:', error);
        throw error;
    } finally {
        client.release();
    }
}


module.exports = {
    getAllDepartments,
    getAllRoles,
    getAllEmployees,
    insertDepartment,
    insertRole,
    insertEmployee,
    updateEmployeeRole
};