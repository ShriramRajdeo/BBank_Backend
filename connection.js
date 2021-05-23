const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.MYSQL_DB
  });

  conn.connect((err)=> {
    if (!err) {
        console.log('Database is connected successfully !');
    }
    else{
        console.log('Connection Failed !'+ err.message);
    }
  });

  module.exports=conn;