const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysqlConnection = require("../connection");
const bodyParser = require("body-parser");
const joi = require("@hapi/joi");    // For Validation
const e = require('express');

function allBankDetails(req, res){
    var selectQuery = "SELECT bankId ,name , emailId,mobile,pincode from Bloodbankdata";
    mysqlConnection.query(selectQuery,(err, rows, fields) => {
        if (err) res.status(400).send({ message: err });
        if(rows.length<=0){
            res.status(204).send({ message: "Blood Banks not available" })
        }
        res.status(200).send(rows[0]);
    });
}


function getCounts(req, res){
    var selectQuery = "SELECT COUNT(*) FROM userdata UNION SELECT COUNT(*) FROM bloodbankdata UNION SELECT COUNT(*) FROM campdata WHERE CURDATE() between fromDate and toDate";
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