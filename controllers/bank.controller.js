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
        if (err) res.status(400).send({ message: err });
        res.status(200).send(rows[0])
    }); 
}

function updateProfile(req, res){
    var email = req.body.data.email
    var updateQuery = "update bloodbankdata set name=?, mobile=?, pincode=? where emailId = ?";
    mysqlConnection.query(updateQuery,[req.body.name,req.body.mobile,req.body.pincode, email],(err, rows, fields) => {
        if (err) res.status(400).send({ message: err });
    });

    var selectQuery = "SELECT bankId , name, emailId, mobile, pincode from bloodBankData where emailId = ?";
    mysqlConnection.query(selectQuery,[email],(err, rows, fields) => {
        if (err) res.status(400).send({ message: err });
        res.status(200).send(rows[0])
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
 
    var stockDetail=[];
    stockDetail.push(bankId);
    stockDetail.push(req.body['Apos']);
    stockDetail.push(req.body['Aneg']);
    stockDetail.push(req.body['Bpos']);
    stockDetail.push(req.body['Bneg']);
    stockDetail.push(req.body['ABpos']);
    stockDetail.push(req.body['ABneg']);
    stockDetail.push(req.body['Opos']);
    stockDetail.push(req.body['Oneg']);
    stockDetail.push(date + "-" + month + "-" +year+"  "+hours + ":" + minutes);


    var checkExistsQuery = "SELECT * from stockData where bankId = ?";
    mysqlConnection.query(checkExistsQuery,[bankId],(err, rows, fields) => {
        let stockExist=false;
        rows.length>0 ? stockExist=true : stockExist=false;

        if(!stockExist){
            var insertQuery = 'INSERT INTO stockData() values (?)';
            mysqlConnection.query(insertQuery,
                    [stockDetail], (err, rows, fields) => {
                    !err ? res.status(200).send({ message: "Inserted succesfully" })
                         : res.status(400).send({ message: err });
                }
            );
            console.log("Blood Stock stored successfully!");
        }else{
            var updateQuery = 'UPDATE stockData set Apos=? , Aneg=? , Bpos=? ,Bneg=? ,ABpos=? ,ABneg=? ,Opos=? ,Oneg=? ,LastUpdated=? where bankId = ?';
            mysqlConnection.query(updateQuery,[stockDetail[1],stockDetail[2],stockDetail[3],stockDetail[4],stockDetail[5],stockDetail[6],stockDetail[7],stockDetail[8],stockDetail[9],bankId],(err, result, fields) => {
                if (err) res.status(400).send({ message: err });
                res.status(200).send({ message: "Updated succesfully" })
                });
            console.log("Blood Stock updated successfully!");
        }
    });
}

function getStockOfBank(req, res){
    var id = req.body.data.id
    var selectQuery = "SELECT * from stockData where bankId = ?";
    mysqlConnection.query(selectQuery,[id],(err, rows, fields) => {
        if (err) res.status(400).send({ message: err });
        res.status(200).send(rows[0])
    }); 
}


function bloodRequestFromUser(req, res){
    var id = req.body.data.id
    var selectQuery = "SELECT * from requestData where bankId = ?";
    mysqlConnection.query(selectQuery,[id],(err, rows, fields) => {
        if (err) res.status(400).send({ message: err });
        if(rows.length<=0){
            console.log("No Request found")
            res.status(204).send({ message: "Request not available" })
        }
        res.status(200).send(rows[0])
    }); 
}

function validateBloodRequest(req, res){
    var bankId = req.body.data.id
    var userId = req.body.userId
    var bloodGr = req.body.bloodGr
    var amount = req.body.amount
    

    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth()+1;
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    var LastUpdated = date + "-" + month + "-" +year+"  "+hours + ":" + minutes

    var getStockQuery = "SELECT * from stockData where bankId = ?";
    mysqlConnection.query(getStockQuery,[bankId],(err, rows, fields) => {
        let stockExist=false;
        rows.length>0 ? stockExist=true : stockExist=false;

        if(stockExist){
            rows[0][bloodGr] = rows[0][bloodGr] - amount
            rows[0].LastUpdated = LastUpdated

            var stockDetail=[];
            stockDetail.push(bankId);
            stockDetail.push(rows[0]['Apos']);
            stockDetail.push(rows[0]['Aneg']);
            stockDetail.push(rows[0]['Bpos']);
            stockDetail.push(rows[0]['Bneg']);
            stockDetail.push(rows[0]['ABpos']);
            stockDetail.push(rows[0]['ABneg']);
            stockDetail.push(rows[0]['Opos']);
            stockDetail.push(rows[0]['Oneg']);
            stockDetail.push(rows[0]['LastUpdated']);

            var status = "Confirmed"
            var updateQuery = 'UPDATE requestData set status=? where bankId = ? and userId = ?';
            mysqlConnection.query(updateQuery,[status,bankId,userId],(err, result, fields) => {
                if (err) res.status(400).send({ message: err });
                });
            
            var updateQuery = 'UPDATE stockData set Apos=? , Aneg=? , Bpos=? ,Bneg=? ,ABpos=? ,ABneg=? ,Opos=? ,Oneg=? ,LastUpdated=? where bankId = ?';
            mysqlConnection.query(updateQuery,[stockDetail[1],stockDetail[2],stockDetail[3],stockDetail[4],stockDetail[5],stockDetail[6],stockDetail[7],stockDetail[8],stockDetail[9],bankId],(err, result, fields) => {
                if (err) res.status(400).send({ message: err });
                });

            res.status(200).send({ message: "Request Verified" });         
        }else{
            console.log("Stock doesn't exists!");
            return res.status(400).send({ message: 'Stock is not available!' }); 
        }
    });
}



module.exports = {
    profile: profile,
    updateProfile: updateProfile,
    storeStock: storeStock,
    getStockOfBank: getStockOfBank,
    bloodRequestFromUser: bloodRequestFromUser,
    validateBloodRequest: validateBloodRequest
}