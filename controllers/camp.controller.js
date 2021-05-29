const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysqlConnection = require("../connection");
const bodyParser = require("body-parser");
const joi = require("@hapi/joi");    // For Validation
const e = require('express');


const schema = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().min(6).max(20).required().email(),
    mobile: joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': 'Phone number must have 10 digits.'}).required(),
    fromDate: joi.date().raw().required(),
    toDate: joi.date().raw().required(),
    address: joi.string().max(20).required(),
    pincode: joi.string().max(6).required(),
    city: joi.string().max(20).required(),
    state: joi.string().max(20).required(),
    country: joi.string().max(20).required()
});

function showCampByBank(req, res){
    var id = req.body.data.id 
    var selectQuery = "SELECT * from campData where bankId = ?";
    mysqlConnection.query(selectQuery,[id],(err, rows, fields) => {
        if (err) res.status(400).send({ message: err });
        res.status(200).send(rows)
    });
}

function showCampsToUser(req, res){
    var selectQuery = "SELECT * from campData";
    mysqlConnection.query(selectQuery,(err, rows, fields) => {
        if (err) res.status(400).send({message:err})
        res.status(200).send(rows);
    });
}

function registerToCamp(req,res) {
    let campId = req.body.campId
    let userId = req.body.data.id
    data=[]
    data.push(campId)
    data.push(userId)
  
    var checkExistsQuery = "SELECT * from registerData where campId = ? and userId = ?";
    mysqlConnection.query(checkExistsQuery,[data[0],data[1]],(err, rows, fields) => {
        let exist=false;
        rows.length>0 ? exist=true : exist=false;
        if(!exist){
            var insertQuery = 'INSERT INTO registerData(campId, userId) values (?)';
            mysqlConnection.query(insertQuery,
                    [data], (err, rows, fields) => {
                    !err
                        ? res.status(200).send({ message: "registerd successfully" })
                        : res.status(400).send({ message: err });
                }
            );    
        }
        else{
            res.status(200).send({ message: "Already Registerd" })
        }
    });
    
}

function showRegistrationForCamp(req, res){
    let campId = req.body.campId

    var selectQuery = 'SELECT campData.name,userData.name, userData.emailId, userData.mobile FROM ((campData INNER JOIN registerData ON campData.campID = registerData.campID) INNER JOIN userData ON userData.userId=registerData.userId and registerData.campId= ?)';
    mysqlConnection.query(selectQuery,campId,(err, rows, fields) => {
        if (err) res.status(400).send({message:err})
        res.status(200).send(rows);
    });
}

function showRegisteredCamp(req, res){
    let userId = req.body.data.id

    var selectQuery = 'SELECT campData.name,campData.emailId,campData.mobile,campData.fromDate,campData.toDate,campData.address,campData.pincode,campData.city,campData.country FROM campData INNER JOIN registerData ON campData.campID = registerData.campID and registerData.userId= ?';
    mysqlConnection.query(selectQuery,userId,(err, rows, fields) => {
        if (err) res.status(400).send({message:err})
        res.status(200).send(rows);
    });
}


function organizeCamp(req, res){
    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send({message:error.details[0].message});

    var bankId = req.body.data.id
    var campDetail=[];
    campDetail.push(bankId);
    campDetail.push(req.body.name);
    campDetail.push(req.body.email);
    campDetail.push(req.body.mobile);
    campDetail.push(req.body.fromDate);
    campDetail.push(req.body.toDate);
    campDetail.push(req.body.address);
    campDetail.push(req.body.pincode);
    campDetail.push(req.body.city);
    campDetail.push(req.body.state);
    campDetail.push(req.body.country);

    var checkExistsQuery = "SELECT * from campData where name = ? and fromDate = ? and toDate = ?";
    mysqlConnection.query(checkExistsQuery,[req.body.name,req.body.fromDate,req.body.toDate],(err, rows, fields) => {
        let campExist=false;
        rows.length>0 ? campExist=true : campExist=false;

        if(!campExist){
            var insertQuery = 'INSERT INTO campData(bankId, name, emailId, mobile, fromDate, toDate, address , pincode, city, state, country) values (?)';
            mysqlConnection.query(insertQuery,
                    [campDetail], (err, rows, fields) => {
                    !err
						? res.status(200).send({ message: "registerd successfully" })
						: res.status(400).send({ message: err });
                }
            );
            console.log("Camp created successfully!");
        }else{
            console.log("Camp already exists!");
            return res.status(400).send({message:'Camp already exists!'});
        }
    });
}


module.exports = {
    organizeCamp: organizeCamp,
    showCampByBank: showCampByBank,
    showCampsToUser: showCampsToUser,  
    registerToCamp: registerToCamp,
    showRegistrationForCamp:showRegistrationForCamp,
    showRegisteredCamp: showRegisteredCamp
}