-- Insert departments if they don't already exist
INSERT INTO department (name) 
VALUES 
    ('Sales'), 
    ('Marketing'), 
    ('Finance')
ON CONFLICT (name) DO NOTHING;

-- Insert roles if they don't already exist
INSERT INTO role (title, salary, department_id) 
VALUES 
    ('Sales Manager', 60000, 1), 
    ('Marketing Coordinator', 45000, 2), 
    ('Financial Analyst', 55000, 3)
ON CONFLICT (title) DO NOTHING;

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id, department_id, salary) 
VALUES 
    ('John', 'Doe', 1, 1, 1, 60000), 
    ('Jane', 'Smith', 2, 2, 2, 45000), 
    ('Michael', 'Johnson', 3, 3, 3, 55000);


