const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mysqlConnection = require("../connection");


router.get("/",function(req,res){
    res.sendFile("F:/projects/Visual studio code/BBank_Backend/loginPage.html");    
});

router.post("/",function(req,res){
    var name= req.body.username;
    var password= req.body.password;
    
    var userDetail=[];
    userDetail.push(name);
    userDetail.push(password);

// insert user data into users table
    var sql = 'INSERT INTO userLogin (name, password) values (?)';

    mysqlConnection.query(sql,[userDetail],function (err, data) { 
        if (err) throw err;
        console.log("User data is inserted successfully "); 
    });

    res.send("Saved in database");
});

module.exports = router;