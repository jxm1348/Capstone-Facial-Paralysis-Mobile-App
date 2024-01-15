const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Database Details
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'JoshFar',
  password: 'JoshuaTempPassword',
  database: 'capstone',
});


//Connection attempt
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL!');
  }
});


//Logic for login page
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('MySQL query error:', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }

    if (results.length > 0) {
      const user = results[0];

      res.json({
        success: true,
        message: 'Login successful',
        userType: user.type,
      });
    } else {
      res.status(401).json({ error: 'Invalid username or password.' });
    }
  });
});

