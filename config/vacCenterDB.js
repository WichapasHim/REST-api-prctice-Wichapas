const mysql = require("mysql");

var connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Himbet1152@",
  database: "vaccenter",
});

module.exports = connection;
