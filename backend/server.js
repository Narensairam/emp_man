const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    port: 3306,
    host: 'bl77mypnlk3rlj25am5t-mysql.services.clever-cloud.com',
    user: 'uljlyrjcy6ozgygy',
    password: 's5mAFxmGDYEXxmF9NCdA',
    database: 'bl77mypnlk3rlj25am5t'
});

db.connect(err => {
    if (err) console.error('DB connection failed:', err);
    else console.log('DB connected.');
});

app.post('/add-employee', (req, res) => {
    const { name, empid, email, phno, dept, doj, role } = req.body;

    if (!name || !empid || !email || !phno || !dept || !doj || !role) {
        return res.status(400).send('All fields are mandatory.');
    }

    const query = `
        INSERT INTO employees (name, empid, email, phno, dept, doj, role) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
        `CREATE TABLE IF NOT EXISTS employees (
        name VARCHAR(255) NOT NULL,
        empid VARCHAR(10) NOT NULL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        phno CHAR(10) NOT NULL,
        dept ENUM('HR', 'Engineering', 'Marketing') NOT NULL,
        doj DATE NOT NULL,
        role VARCHAR(100) NOT NULL);`
);
    db.query(
        query,
        [name, empid, email, phno, dept, doj, role],
        (err, results) => {
            if (err) {
                res.status(400).send(JSON.parse(err));
            } else {
                res.status(201).send('Employee added successfully.');
            }
        }
    );
});
app.get('/get-employee/:empid', (req, res) => {
    const { empid } = req.params;

    const query = 'SELECT * FROM employees WHERE empid = ?';
    db.query(query, [empid], (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving employee data.');
        } else if (results.length === 0) {
            res.status(404).send('Employee not found.');
        } else {
            res.status(200).json(results[0]);
        }
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

