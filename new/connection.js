var mysql = require("mysql");

var pool = mysql.createPool({
    connectionLimit: 1000, // Adjust as needed
    host: "localhost",
    user: "root",
    password: "Admin@123",
    database: "mortgage"
});



module.exports = pool;
