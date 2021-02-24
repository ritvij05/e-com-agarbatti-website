const mysql = require('mysql');
require('dotenv').config();


// Database connection
var pool  = mysql.createPool({
  connectionLimit : 10,
  queueLimit: 100,
  // password: process.env.password,
  // database: process.env.DataBase,
  // host: process.env.Server,
  // user: process.env.Username,
  // host: process.env.HOST,
  // user: process.env.USER,
  // password: process.env.PASS,
  // database: process.env.DB,
  host: process.env.HOST_R,
  user: process.env.USER_R,
  password: process.env.PASS_R,
  database: process.env.DB_R,
  port:3306,
  connectTimeout : 10000,
  waitForConnections: true,
  acquireTimeout: 10000,
  debug : false
});

pool.on('connection', function (connection) {
  console.log('MySQL DB Connection established');
});

pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});

pool.on('enqueue', function () {
  console.log('Waiting for available connection slot...');
});

pool.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId);
});

module.exports = pool;