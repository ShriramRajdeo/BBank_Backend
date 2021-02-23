const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mysqlConnection = require("../connection");


router.get("/",function(req,res){
    res.sendFile("F:/projects/Visual studio code/BBank_Backend/loginPage.html");    
});

router.post("/",function(req,res){

    var category ="user";

    var name= req.body.username;
    var password= req.body.password;   
    var emailId = "sample@gmail.com";
    var mobile = "1234567890";
   
    var pincode = "414105";
    var city = "Pune";
    var state = "Maharashtra";
    var country ="India";

    var locationData=[];
    locationData.push(pincode);
    locationData.push(city);
    locationData.push(state);
    locationData.push(country);


    // user signup
    if(category=="user"){
        var dateofbirth ="31/12/1999";
        var gender = "male";
        var bloodGr = "O+ve";
        
        var userDetail=[];
        userDetail.push(name);
        userDetail.push(emailId);
        userDetail.push(password);
        userDetail.push(mobile);
        userDetail.push(dateofbirth);
        userDetail.push(gender);
        userDetail.push(bloodGr);
        userDetail.push(pincode);
    
        // Create table userData if not exixts
    
        var sqltable = "CREATE TABLE IF NOT EXISTS userData( userId int NOT NULL AUTO_INCREMENT, name varchar(40) NOT NULL, emailId varchar(40) NOT NULL,password varchar(40) NOT NULL,mobile varchar(10) NOT NULL,dob varchar(10) NOT NULL,gender varchar(15) NOT NULL,bloodGr varchar(15) NOT NULL,pincode varchar(6) NOT NULL,PRIMARY KEY (userId),FOREIGN KEY (pincode) REFERENCES location(pincode));";
    
        mysqlConnection.query(sqltable,function (err, data) { 
            if (err) throw err;
            console.log("UserData table created successfully "); 
        });
    
    
        // Create location table if not exists
        var sql = 'CREATE TABLE IF NOT EXISTS location(pincode varchar(6) NOT NULL UNIQUE,city varchar(30) NOT NULL,state varchar(30) NOT NULL,country varchar(30) NOT NULL,PRIMARY KEY (pincode));';
        
        mysqlConnection.query(sql,function (err, data) { 
            if (err) throw err;
            console.log("location table created successfully "); 
        });
    
        //insert location in location table 
        var sqlLocation = 'INSERT INTO location (pincode, city, state ,country) values (?)';
    
        mysqlConnection.query(sqlLocation,[locationData],function (err, data) { 
            if (err) throw err;
            console.log("location data is inserted successfully "); 
        });
    
        // insert user data into userData table
        var sql = 'INSERT INTO userData (name, emailId, password ,mobile, dob, gender, bloodGr , pincode) values (?)';
    
        mysqlConnection.query(sql,[userDetail],function (err, data) { 
            if (err) throw err;
            console.log("User data is inserted successfully "); 
        });

    }
    // Blood Bank signup
    else if(category=="bloodbank"){
        var bankDetail=[];
        bankDetail.push(name);
        bankDetail.push(emailId);
        bankDetail.push(password);
        bankDetail.push(mobile);
        bankDetail.push(pincode);

        // Create location table if not exists
        var sql = 'CREATE TABLE IF NOT EXISTS location(pincode varchar(6) NOT NULL UNIQUE,city varchar(30) NOT NULL,state varchar(30) NOT NULL,country varchar(30) NOT NULL,PRIMARY KEY (pincode));';

        mysqlConnection.query(sql,function (err, data) { 
            if (err) throw err;
            console.log("location table created successfully "); 
        });
    
        //insert location in location table 
        var sqlLocation = 'INSERT INTO location (pincode, city, state ,country) values (?)';
    
        mysqlConnection.query(sqlLocation,[locationData],function (err, data) { 
            if (err) throw err;
            console.log("location data is inserted successfully "); 
        });


        // Create bloodBankData table if not exists
        var sql = 'CREATE TABLE IF NOT EXISTS bloodBankData(bankId int NOT NULL AUTO_INCREMENT, name varchar(40) NOT NULL, emailId varchar(40) NOT NULL, password varchar(40) NOT NULL, mobile varchar(10) NOT NULL, pincode varchar(6) NOT NULL,PRIMARY KEY (bankId), FOREIGN KEY (pincode) REFERENCES location(pincode));';

        mysqlConnection.query(sql,function (err, data) { 
            if (err) throw err;
            console.log("bloodBankData table created successfully "); 
        });


        // insert blood Bank Data into bloodBankData table
        var sql = 'INSERT INTO bloodBankData (name, emailId, password ,mobile, pincode) values (?)';
    
        mysqlConnection.query(sql,[bankDetail],function (err, data) { 
            if (err) throw err;
            console.log("blood bank  data is inserted successfully "); 
        });

    }

    // send response to user
    res.send("Saved in database");
});

module.exports = router;