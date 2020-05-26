/*
Author: Raya Farshad
Date: 12/16/19
Description: This file holds the pool data for connections.
*/

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "team11",
  password: "team11",
  database: "team11db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection(err => {
  if (err) throw err;
  console.log("My database is connected!");
  //pool.query('test_raya');
});

module.exports = pool;
