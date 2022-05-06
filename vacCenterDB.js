const mysql = require("mysql");
var connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "0867644280",
  database: "vacCenter"
});

module.exports = connection;
