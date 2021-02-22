const mysql = require("mysql");

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",      
    password: "Shriram@1234",      
    database: "firstlogin"
  });
 
  conn.connect((err)=> {
    if (!err) {
        console.log('Database is connected successfully !');    
    }
    else{
        console.log('Connection Failed !'+err.log);    
    }
  });

  module.exports=conn;