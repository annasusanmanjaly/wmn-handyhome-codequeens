const express = require('express');
const mysql2 = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public2')));

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'suharak1357',
  database: 'banglore',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

app.get('/', function (req, res) {
  console.log('GET /');
  res.sendFile(path.join(__dirname, 'public2', 'Signup', 'Signup.html'));
});

app.post('/', function (req, res) {
  console.log('POST /');
  const { username, email, password } = req.body;
  console.log('Received data:', username, email, password);
  if (username && email && password) {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.log('Error hashing password:', err);
        res.redirect('/');
      } else {
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        connection.query(sql, [username, email, hash], (err, result) => {
          if (err) {
            console.log('Error inserting user into database:', err);
            res.redirect('/');
          } else {
            console.log('User inserted into database:', result);
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/adress');
          }
        });
      }
    });
  } else {
    res.redirect('/');
  }
});