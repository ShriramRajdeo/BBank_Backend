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
    
        //insert location in location table 
        var sqlLocation = 'INSERT INTO location (pincode, city, state ,country) values (?)';    
        mysqlConnection.query(sqlLocation,[locationData],function (err, data) { 
            if (err) throw err;
            console.log("location data is inserted successfully "); 
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