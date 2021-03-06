const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysqlConnection = require("../connection");
const bodyParser = require("body-parser");
const joi = require("@hapi/joi");    // For Validation


const schema = joi.object({
    category: joi.string().min(3).max(10).required(),
    userName: joi.string().min(2).max(40),
    bloodBankName: joi.string().min(2).max(40),
    emailId: joi.string().min(6).max(40).required().email(),
    password: joi.string().min(6).required(),
    mobile: joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': 'Phone number must have 10 digits.'}),
    dateofbirth: joi.date().raw(),
    gender: joi.string(),
    bloodGr: joi.string(),
    pincode: joi.string().max(6),
    address: joi.string().max(20),
    city: joi.string().max(20),
    state: joi.string().max(20),
    country: joi.string().max(20)
});


async function signUp(req, res){
    //Validate the data
    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send({message:error.details[0].message});

    //salting
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(req.body.password, salt);

    switch(req.body.category) {
        case 'user':
          userRegistration(req,res,hashedPassword);
          break;
        case 'bbank':
          bankRegistration(req,res,hashedPassword);
          break;
        case 'admin':
          // code block
          break;
      }
       console.log("Done");
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
    userDetail.push(req.body.address);
    userDetail.push(req.body.city);
    userDetail.push(req.body.state);
    userDetail.push(req.body.country);

    var checkExistsQuery = "SELECT * from userdata where emailId = ?";
    mysqlConnection.query(checkExistsQuery,[req.body.emailId],(err, rows, fields) => {
        let emailExist=false;
        rows.length>0 ? emailExist=true : emailExist=false;

        if(!emailExist){
            var insertQuery = 'INSERT INTO userdata (name, emailId, password ,mobile, dob, gender, bloodGr , pincode, address, city, state ,country) values (?)';
            mysqlConnection.query(insertQuery,
                    [userDetail], (err, rows, fields) => {
                    !err
						? res.status(200).send({ message: "signup succesfully" })
						: res.status(400).send({ message: err });
                }
            );
        }else{
            return res.status(401).send({message:'Email already exists!'});
        }

    });
}

function bankRegistration(req,res,hashedPassword) {
    var bankDetail=[];
    bankDetail.push(req.body.bloodBankName);
    bankDetail.push(req.body.emailId);
    bankDetail.push(hashedPassword);
    bankDetail.push(req.body.mobile);
    bankDetail.push(req.body.pincode);
    bankDetail.push(req.body.address);
    bankDetail.push(req.body.city);
    bankDetail.push(req.body.state);
    bankDetail.push(req.body.country);

    var checkExistsQuery = "SELECT * from bloodBankData where emailId = ?";
    mysqlConnection.query(checkExistsQuery,[req.body.emailId],(err, rows, fields) => {
        let emailExist=false;
        rows.length>0 ? emailExist=true : emailExist=false;

        if(!emailExist){
            var sql = 'INSERT INTO bloodBankData (name, emailId, password ,mobile, pincode, address, city, state ,country) values (?)';
            mysqlConnection.query(sql,[bankDetail], (err, rows, fields) => {
                    !err ?  console.log("data stored"): res.status(400).send({ message: err });
                }
            );

            setStock(req, res);
            console.log("Registration Successful");
        }else{
            console.log("Email already exists!");
            return res.status(401).redirect('/?error=' + encodeURIComponent('Email already exists!'));
        }
    });
}

function setStock(req,res) {
    console.log("in setstock!");
    let email=req.body.emailId;

    var getIdQuery = "SELECT bankId from bloodbankData where emailId = ?";
    mysqlConnection.query(getIdQuery,[email],(err, rows, fields) => {
        let bankId =rows[0].bankId;
        let stockdata=[]
        stockdata.push(bankId);
        stockdata.push(0);
        stockdata.push(0);
        stockdata.push(0);
        stockdata.push(0);
        stockdata.push(0);
        stockdata.push(0);
        stockdata.push(0);
        stockdata.push(0);
        stockdata.push('null');

        var insertQuery = 'INSERT INTO stockData () values (?)';
        mysqlConnection.query(insertQuery,
                [stockdata], (err, rows, fields) => {
                !err ? res.status(200).send({ message: "Inserted succesfully" })
                        : res.status(400).send({ message: err });
            }
        );
    });

}

function login(req, res){
    //Validate the data
    const {error} = schema.validate(req.body);
    console.log(error);

    if (error) return res.status(400).send({ message: error.details[0].message });

    var checkExistsQuery;
    console.log(req.body.category + "   " + req.body.emailId + "   " + req.body.password);
    switch(req.body.category) {
        case 'user':
          checkExistsQuery = "SELECT emailId,password,userId from userData where emailId = ?";
          break;
        case 'bbank':
          checkExistsQuery = "SELECT emailId,password,bankId from bloodbankdata where emailId = ?";
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
            res.status(401).send({
                message: "Invalid credentials!",
            });
        }else{
            loginCredentials=rows[0];
            var idFromDB
            for(var myKey in loginCredentials) {
                if (myKey=="emailId" ||myKey=="password") {
                    continue
                }
                idFromDB = loginCredentials[myKey];
             }

            bcrypt.compare(req.body.password, loginCredentials.password, function(err, result){
                if(result){
                    const token = jwt.sign({
                        email: loginCredentials.emailId,
                        id: idFromDB,
                    }, process.env.JWT_KEY, function(err, token){
                        res.status(200).send({
                            message: "Authentication successful!",
                            token: token
                        });
                    });
                    console.log('done login');
                }else{
                    res.status(401).json({
                        message: "Invalid credentials!",
                    });
                }
            });
        }
    });
}


// LOGOUT
function logout(req, res){
    res.clearCookie('nToken');
    console.log('done loout');
    return res.redirect('/');
}

module.exports = {
    signUp: signUp,
    login: login,
    logout: logout
}