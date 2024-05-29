const fs = require('fs');
const { Pool } = require('pg'); // Import Pool class from pg module
const inquirer = require('inquirer');
const { getAllDepartments, getAllEmployees, getAllRoles, insertDepartment, insertRole, insertEmployee, updateEmployeeRole } = require('./utils/queries');
const pool = require('./config/db'); // Import the pool object from db.js

// Function to execute schema script
async function executeSchemaScript() {
    try {
        // Read schema.sql file
        const schemaSQL = fs.readFileSync('./db/schema.sql', 'utf8');

        // Execute schema script
        await pool.query(schemaSQL);

        console.log('Schema created successfully');
    } catch (error) {
        console.error('Error executing schema script:', error);
    } finally {
        // No need to close the database connection here as it will be handled by the pool
    }
}

// Function to perform database operations
async function performDatabaseOperations() {
    try {
        const result = await pool.query('SELECT * FROM department');
        console.log('Result:', result.rows);
    } catch (error) {
        console.error('Error:', error);
    } finally {
    }
}

// Call the function to perform database operations
// performDatabaseOperations();

// Function to display all departments
async function viewAllDepartments() {
    const departments = await getAllDepartments();
    console.log(departments);
    const table = departments.map(({ id, name }) => ({ ID: id, Name: name }));
    console.table(table);
    await mainMenu();
}

// Function to display all roles
async function viewAllRoles() {
    const roles = await getAllRoles();
    const table = roles.map(({ id, title, salary, department_name }) => ({ ID: id, Title: title, Salary: salary, Department: department_name }));
    console.table(table);
    await mainMenu();
}

// Function to display all employees
async function viewAllEmployees() {
    const employees = await getAllEmployees();
    const table = employees.map(({ employee_id, first_name, last_name, job_title, department, salary, manager_name }) => ({ 'Employee ID': employee_id, 'First Name': first_name, 'Last Name': last_name, 'Job Title': job_title, 'Department': department, 'Salary': salary, 'Manager Name': manager_name }));
    console.table(table);
    await mainMenu();
}


// Function to add a department
async function addDepartment() {
    const { departmentName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the department:'
        }
    ]);

    try {
        // Call the insertDepartment function to insert the new department into the database
        await insertDepartment(departmentName);
        console.log(`Department "${departmentName}" added successfully!`);
    } catch (error) {
        console.error('Error adding department:', error);
    } finally {
        await mainMenu();
    }
}

async function addRole() {
    // Prompt the user for role information
    const { roleName, roleSalary, departmentId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: 'Enter the name of the role:'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'Enter the salary for the role:'
        },
        {
            type: 'input',
            name: 'departmentId',
            message: 'Enter the department ID for the role:'
        }
    ]);

    try {
        // Call a function to insert the new role into the database
        await insertRole(roleName, roleSalary, departmentId);
        console.log(`Role "${roleName}" added successfully!`);
    } catch (error) {
        console.error('Error adding role:', error);
    } finally {
        // Return to the main menu
        await mainMenu();
    }
}


async function addEmployee() {
    try {
        // Prompt the user to provide the first name and last name of the employee
        const { firstName, lastName } = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter the first name of the employee:'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter the last name of the employee:'
            }
        ]);

        // Retrieve all current roles from the database
        const roles = await getAllRoles();
        const roleChoices = roles.map(role => ({
            name: role.title,
            value: { id: role.id, title: role.title, salary: role.salary, departmentId: role.department_id }
        }));

        // Prompt the user to select a role
        const { selectedRole } = await inquirer.prompt({
            type: 'list',
            name: 'selectedRole',
            message: 'Select the role for the employee:',
            choices: roleChoices
        });

        // Retrieve all departments from the database
        const departments = await getAllDepartments();
        const departmentChoices = departments.map(department => ({
            name: department.name,
            value: department.id
        }));

        // Prompt the user to select a department
        const { selectedDepartment } = await inquirer.prompt({
            type: 'list',
            name: 'selectedDepartment',
            message: 'Select the department for the employee:',
            choices: departmentChoices
        });

        // Retrieve all current managers from the database
        const employees = await getAllEmployees();
        const managerChoices = employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: { id: employee.employee_id, name: `${employee.first_name} ${employee.last_name}` }
        }));

        // Prompt the user to select a manager
        const { selectedManager } = await inquirer.prompt({
            type: 'list',
            name: 'selectedManager',
            message: 'Select the manager for the employee:',
            choices: managerChoices
        });

        // Insert the new employee into the database
        await insertEmployee(firstName, lastName, selectedRole.id, selectedManager.id, selectedDepartment);
        console.log('Employee added successfully!');
    } catch (error) {
        console.error('Error adding employee:', error);
    } finally {
        await mainMenu();
    }
}


// Function to update an employee's role
async function updateEmployeeRoleMenu() {
    try {
        const employees = await getAllEmployees();
        const employeeChoices = employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.employee_id
        }));

        const { selectedEmployeeId } = await inquirer.prompt({
            type: 'list',
            name: 'selectedEmployeeId',
            message: 'Select the employee whose role you want to update:',
            choices: employeeChoices
        });

        const roles = await getAllRoles();
        const roleChoices = roles.map(role => ({
            name: role.title,
            value: role.id
        }));

        const { selectedRoleId } = await inquirer.prompt({
            type: 'list',
            name: 'selectedRoleId',
            message: 'Select the new role for the employee:',
            choices: roleChoices
        });

        await updateEmployeeRole(selectedEmployeeId, selectedRoleId);
    } catch (error) {
        console.error('Error updating employee role:', error);
    } finally {
        await mainMenu();
    }
}

// Main function to display the menu and handle user input
async function mainMenu() {
    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Exit'
            ]
        }
    ]);

    switch (choice) {
        case 'View All Departments':
            await viewAllDepartments();
            break;
        case 'View All Roles':
            await viewAllRoles();
            break;
        case 'View All Employees':
            await viewAllEmployees();
            break
        case 'Add a Department':
            await addDepartment();
            break
        case 'Add a Role':
            await addRole();
            break
        case 'Add an Employee':
            await addEmployee();
            break
        case 'Update an Employee Role':
            await updateEmployeeRoleMenu();
            break            
        case 'Exit':
            console.log('Goodbye!');
            process.exit(0);
    }
}

// Function to start the application
async function start() {
    console.log('Welcome to Your Application!');
    await executeSchemaScript(); // Execute schema creation script
    await mainMenu(); // Display main menu and handle user input
    await performDatabaseOperations(); // Query tables after data insertion
}


// Start the application
start();