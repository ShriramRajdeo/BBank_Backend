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

function storeStock(req, res){
    var bankId = req.body.data.id
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth()+1;
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    var day = date_ob.toString().split(' ')[0];

    var stockDetail=[];
    stockDetail.push(bankId);
    stockDetail.push(req.body['A+']);
    stockDetail.push(req.body['A-']);
    stockDetail.push(req.body['B+']);
    stockDetail.push(req.body['B-']);
    stockDetail.push(req.body['AB+']);
    stockDetail.push(req.body['AB-']);
    stockDetail.push(req.body['O+']);
    stockDetail.push(req.body['O-']);
    stockDetail.push(date + "-" + month + "-" +year+"  "+hours + ":" + minutes);


    var checkExistsQuery = "SELECT * from stockData where bankId = ?";
    mysqlConnection.query(checkExistsQuery,[bankId],(err, rows, fields) => {
        let stockExist=false;
        rows.length>0 ? stockExist=true : stockExist=false;

        if(!stockExist){
            var insertQuery = 'INSERT INTO stockData() values (?)';
            mysqlConnection.query(insertQuery,
                    [stockDetail], (err, rows, fields) => {
                    !err ? res.redirect("/") : console.log(err);
                }
            );
            console.log("Blood Stock stored successfully!");
        }else{
            console.log("Blood Stock already stored!");
            return res.redirect('/?error=' + encodeURIComponent('Camp already exists!')); 
        }
    });
}

function getStockOfBank(req, res){
    var id = req.body.data.id
    var selectQuery = "SELECT * from stockData where bankId = ?";
    mysqlConnection.query(selectQuery,[id],(err, rows, fields) => {
        if (err) console.log(err)
        res.json(rows[0])
    }); 
}


module.exports = {
    profile: profile,
    storeStock: storeStock,
    getStockOfBank: getStockOfBank
} 
