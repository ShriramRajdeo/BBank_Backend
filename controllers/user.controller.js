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

function updateProfile(req, res){
    var email = req.body.data.email
    var insertQuery = "update userdata set name=?, mobile=?,dob=?, gender=?, bloodGr=?, pincode=? where emailId = ?";
    mysqlConnection.query(insertQuery,[req.body.name,req.body.mobile,req.body.dob,req.body.gender,req.body.bloodGr,req.body.pincode, email],(err, rows, fields) => {
        if (err) console.log(err)
        res.json(rows)
    });
}


function getStock(req, res){
    var selectQuery = "SELECT bloodbankdata.name, bloodbankdata.emailId, bloodbankdata.mobile , bloodbankdata.pincode, stockdata.* FROM stockdata INNER JOIN bloodbankdata ON bloodbankdata.bankId=stockdata.bankId";
    mysqlConnection.query(selectQuery,(err, rows, fields) => {
        if (err) console.log(err)
        res.json(rows)
    });
}

function addRequest(req, res){
    userId = req.body.data.id

    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth()+1;
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();

    var requestDetails = []
    requestDetails.push(req.body.bankId)                            //bankId
    requestDetails.push(req.body.data.id)                           //userId
    requestDetails.push(req.body.bloodGr)                           //bloodGr
    requestDetails.push(req.body.amount)                            //amount
    requestDetails.push(date + "-" + month + "-" +year)             // date
    requestDetails.push(hours + ":" + minutes)                      //time
    requestDetails.push('Pending')                                  //status

    var checkExistsQuery = "SELECT * from requestData where userId = ?";
    mysqlConnection.query(checkExistsQuery,[userId],(err, rows, fields) => {
        let requestExist=false;
        rows.length>0 ? requestExist=true : requestExist=false;

        if(requestExist){
            console.log("Request already exists , You can only do one request per day!");
            return res.redirect('/?error=' + encodeURIComponent('request already exists , You can only do one request per day!')); 
        }
        else{  
            var stockExistsQuery = "SELECT * from stockData where bankId = ?";
            mysqlConnection.query(stockExistsQuery,[req.body.bankId],(err, rows, fields) => {
                let stockExist=false;
                rows.length>0 ? stockExist=true : stockExist=false;
        
                if(stockExist){
                    let available=false;
                    var stockAmount = rows[0][req.body.bloodGr]
                    stockAmount>req.body.amount ? available=true : available=false;
        
                    if(available){
                        var insertQuery = 'INSERT INTO requestData(bankId,userId,bloodGr,amount,date,time,status) values (?)';
                        mysqlConnection.query(insertQuery,
                            [requestDetails], (err, rows, fields) => {
                            !err ? res.redirect("/") : console.log(err);
                        });
        
                        console.log("Request sent successfully!");
                    }else{
                        return res.redirect('/?error=' + encodeURIComponent('Stock is not available!'));
                    }     
                }else{
                    console.log("Stock doesn't exists!");
                    return res.redirect('/?error=' + encodeURIComponent('Stock is not available!')); 
                }
            });
        }
    });
}

function showRequest(req,res) {
    var id = req.body.data.id
    var selectQuery = "SELECT * from requestData where userId = ?";
    mysqlConnection.query(selectQuery,[id],(err, rows, fields) => {
        if (err) console.log(err)
        if(rows.length<=0){
            console.log("No Request found")
        }
        res.json(rows)
    }); 
}

module.exports = {
    profile: profile,
    updateProfile:updateProfile,
    getStock: getStock,
    addRequest: addRequest,
    showRequest: showRequest
} 