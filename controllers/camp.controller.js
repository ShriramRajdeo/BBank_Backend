const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysqlConnection = require("../connection");
const bodyParser = require("body-parser");
const joi = require("@hapi/joi");    // For Validation
const e = require('express');


function showCampByBank(req, res){
    var email = req.body.data.email
    var selectIdQuery = "SELECT bankId from bloodBankData where emailId = ?";
    mysqlConnection.query(selectIdQuery,[email],(err, rows, fields) => {
        if (err) res.status(400).send({ message: err });
        var id = rows[0].bankId
        var selectQuery = "SELECT * from campData where bankId = ?";
        mysqlConnection.query(selectQuery,[id],(err, rows, fields) => {
            if (err) res.status(400).send({ message: err });
            res.status(200).send(rows)
        });
    });
}

function showCampsToUser(req, res){
    var selectQuery = "SELECT * from campData";
    mysqlConnection.query(selectQuery,(err, rows, fields) => {
        if (err) res.status(400).send({message:err})
        res.send(200).json(rows);
    });
}

function organizeCamp(req, res){
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
    showCampsToUser: showCampsToUser
}