const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysqlConnection = require("../connection");
const bodyParser = require("body-parser");

async function signUp(req, res){
    //Sign up

    //salting
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(req.body.password, salt);
    
    switch(req.body.category) {
        case 'user':
          userRegistration(req,res,hashedPassword);
          break;
        case 'bloodbank':
          bankRegistration(req,res,hashedPassword);
          break;
        case 'admin':
          // code block
          break;
      }   
}

function userRegistration(req,res,hashedPassword){
    var userDetail=[];
    userDetail.push(req.body.userName);
    userDetail.push(req.body.emailId);
    userDetail.push(hashedPassword);
    userDetail.push(req.body.mobile);
    userDetail.push(req.body.dateofbirth);
    userDetail.push(req.body.gender);
    userDetail.push(req.body.bloodGr);
    userDetail.push(req.body.pincode);

    var locationData=[];
    locationData.push(req.body.pincode);
    locationData.push(req.body.city);
    locationData.push(req.body.state);
    locationData.push(req.body.country);

    var checkExistsQuery = "SELECT * from userdata where emailId = ?";
    mysqlConnection.query(checkExistsQuery,[req.body.emailId],(err, rows, fields) => {
        let emailExist=false;
        rows.length>0 ? emailExist=true : emailExist=false;

        if(!emailExist){
            var insertQuery = 'INSERT INTO userdata (name, emailId, password ,mobile, dob, gender, bloodGr , pincode) values (?)';
            mysqlConnection.query(insertQuery,
                    [userDetail], (err, rows, fields) => {
                    !err ? res.redirect("/") : console.log(err);
                }
            );    

            //insert location in location table 
            var sqlLocation = 'INSERT INTO location (pincode, city, state ,country) values (?)';
            mysqlConnection.query(sqlLocation,[locationData],function (err, data) { 
                if (err) throw err;
                console.log("location data is inserted successfully "); 
            });

        }else{
            return res.redirect('/?error=' + encodeURIComponent('Email already exists!'));
        }

    }); 
}

function bankRegistration(req,res,hashedPassword) {
    var bankDetail=[];
    bankDetail.push(req.body.name);
    bankDetail.push(req.body.emailId);
    bankDetail.push(hashedPassword);
    bankDetail.push(req.body.mobile);
    bankDetail.push(req.body.pincode);

    var locationData=[];
    locationData.push(req.body.pincode);
    locationData.push(req.body.city);
    locationData.push(req.body.state);
    locationData.push(req.body.country);

    var checkExistsQuery = "SELECT * from bloodBankData where emailId = ?";
    mysqlConnection.query(checkExistsQuery,[req.body.emailId],(err, rows, fields) => {
        let emailExist=false;
        rows.length>0 ? emailExist=true : emailExist=false;

        if(!emailExist){
            var sql = 'INSERT INTO bloodBankData (name, emailId, password ,mobile, pincode) values (?)';
            mysqlConnection.query(sql,[bankDetail], (err, rows, fields) => {
                    !err ? res.redirect("/") : console.log(err);
                }
            );    

            //insert location in location table 
            var sqlLocation = 'INSERT INTO location (pincode, city, state ,country) values (?)';
            mysqlConnection.query(sqlLocation,[locationData],function (err, data) { 
                if (err) throw err;
                console.log("location data is inserted successfully "); 
            });

            console.log("Registration Successful");
        }else{
            console.log("Email already exists!");
            return res.redirect('/?error=' + encodeURIComponent('Email already exists!'));
        }
    }); 
}


function login(req, res){
    var checkExistsQuery;

    switch(req.body.category) {
        case 'user':
          checkExistsQuery = "SELECT emailId,password from userData where emailId = ?";
          break;
        case 'bloodbank':
          checkExistsQuery = "SELECT emailId,password from bloodbankdata where emailId = ?";
          break;
        case 'admin':
          // code block
          break;
      } 
    
    mysqlConnection.query(checkExistsQuery,[req.body.emailId],(err, rows, fields) => {
        let loginCredentials={};
        let emailExist=false;
        rows.length>0 ? emailExist=true : emailExist=false;
        
        if(!emailExist){
            res.status(401).json({
                message: "Invalid credentials!",
            });
        }else{
            loginCredentials=rows[0];
            bcrypt.compare(req.body.password, loginCredentials.password, function(err, result){
                if(result){
                    const token = jwt.sign({
                        email: loginCredentials.emailId,
                    }, process.env.JWT_KEY, function(err, token){
                        res.status(200).json({
                            message: "Authentication successful!",
                            token: token
                        });
                    });
                }else{
                    res.status(401).json({
                        message: "Invalid credentials!",
                    });
                }
            });
        }
    });
}


module.exports = {
    signUp: signUp,
    login: login
} 