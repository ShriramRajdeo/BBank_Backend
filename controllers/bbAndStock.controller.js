const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysqlConnection = require("../connection");
const bodyParser = require("body-parser");
const joi = require("@hapi/joi");    // For Validation
const e = require('express');

function allBankDetails(req, res){
    var selectQuery = "SELECT bankId ,name , emailId,mobile,pincode from Bloodbankdata";
    mysqlConnection.query(selectQuery,(err, rows, fields) => {
        if (err) console.log(err)
        if(rows.length<=0){
            console.log("No Request found")
        }
        res.send(rows)
    });
}


function getCounts(req, res){
    var selectQuery = "SELECT COUNT(*) FROM userdata UNION SELECT COUNT(*) FROM bloodbankdata UNION SELECT COUNT(*) FROM campdata WHERE CURDATE() between fromDate and toDate";
    mysqlConnection.query(selectQuery,(err, rows, fields) => {
        if (err) console.log(err)
        if(rows.length<=0){
            console.log("No Request found")
        }
        res.send(rows)
    });
}


module.exports = {
    allBankDetails: allBankDetails,
    getCounts: getCounts
}