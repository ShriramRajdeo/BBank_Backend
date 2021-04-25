const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysqlConnection = require("../connection");
const bodyParser = require("body-parser");
const joi = require("@hapi/joi");    // For Validation
const e = require('express');


function profile(req, res){
    var email = req.body.data.email
    var selectQuery = "SELECT bankId , name, emailId, mobile, pincode from bloodBankData where emailId = ?";
    mysqlConnection.query(selectQuery,[email],(err, rows, fields) => {
        if (err) console.log(err)
        res.json(rows)
    }); 
}

function showCamp(req, res){
    var email = req.body.data.email
    var selectIdQuery = "SELECT bankId from bloodBankData where emailId = ?";
    mysqlConnection.query(selectIdQuery,[email],(err, rows, fields) => {
        if (err) console.log(err)
        var id = rows[0].bankId
        var selectQuery = "SELECT * from campData where bankId = ?";
        mysqlConnection.query(selectQuery,[id],(err, rows, fields) => {
            if (err) console.log(err)
            res.json(rows)
        });

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
                    !err ? res.redirect("/") : console.log(err);
                }
            );
            console.log("Camp created successfully!");
        }else{
            console.log("Camp already exists!");
            return res.redirect('/?error=' + encodeURIComponent('Camp already exists!')); 
        }
    }); 
}

module.exports = {
    profile: profile,
    organizeCamp: organizeCamp,
    showCamp: showCamp
} 
