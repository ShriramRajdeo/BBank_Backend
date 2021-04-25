const express = require("express");
const router = express.Router();
const bankController = require('../controllers/bank.controller');
const checkAuth = require('../middleware/check-auth');

router.get("/",checkAuth,function(req,res){
    res.send("In Blood Bank");    
});

router.get("/profile",checkAuth,bankController.profile);

router.get("/camp",checkAuth,bankController.showCamp);

router.post("/organizeCamp",checkAuth,bankController.organizeCamp);

module.exports = router;