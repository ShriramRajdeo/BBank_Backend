const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysqlConnection = require("../connection");
const bodyParser = require("body-parser");
const joi = require("@hapi/joi");    // For Validation
const e = require('express');



function profile(req, res){
    var email = req.body.data.email
    var selectQuery = "SELECT userId , name, emailId, mobile,dob, gender, bloodGr, pincode from userdata where emailId = ?";
    mysqlConnection.query(selectQuery,[email],(err, rows, fields) => {
        if (err) console.log(err)
        res.json(rows)
    }); 
}

function showCamp(req, res){
    var selectQuery = "SELECT * from campData";
    mysqlConnection.query(selectQuery,(err, rows, fields) => {
        if (err) console.log(err)
        res.json(rows)
    }); 
}

module.exports = {
    profile: profile,
    showCamp:showCamp
} 