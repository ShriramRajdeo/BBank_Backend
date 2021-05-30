const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysqlConnection = require("../connection");
const bodyParser = require("body-parser");
const joi = require("@hapi/joi");    // For Validation
const e = require('express');

function allBankDetails(req, res){
    var selectQuery = "SELECT bankId,name,pincode,city ,state,country,emailId,mobile,pincode from Bloodbankdata";
    mysqlConnection.query(selectQuery,(err, rows, fields) => {
        if (err) res.status(400).send({ message: err });
        if(rows.length<=0){
            res.status(204).send({ message: "Blood Banks not available" })
        }
        res.status(200).send(rows);
    });
}


function getCounts(req, res){
    var usersQuery = "(select COUNT(*) from userdata ) as users ,";
    var bbanksQuery = "(select COUNT(*) from bloodbankdata ) as bbanks ,";
    var campsQuery = "(select COUNT(*) from campData) as camps , ";
    var stocksQuery = "(select sum (Apos + Aneg + Bpos + Bneg + ABpos + ABneg + Opos + Oneg ) from stockdata) as stocks ";
    
    var selectQuery = "select" +usersQuery+ bbanksQuery+campsQuery+stocksQuery;

    mysqlConnection.query(selectQuery,(err, rows, fields) => {
        if (err) res.status(400).send({ message: err });
        if(rows.length<=0){
            res.status(204).send({ message: "Data not available" })
        }
        res.status(200).send(rows[0]);
    });
}


module.exports = {
    allBankDetails: allBankDetails,
    getCounts: getCounts
}