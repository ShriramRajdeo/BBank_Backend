const express = require("express");
const router = express.Router();
const bankController = require('../controllers/bank.controller');
const campController = require('../controllers/camp.controller');
const functionController = require('../controllers/bbAndStock.controller');
const checkAuth = require('../middleware/check-auth');

router.get("/",checkAuth,function(req,res){
    res.send("In Blood Bank");    
});

router.get("/profile",checkAuth,bankController.profile);
router.put("/updateProfile",checkAuth,bankController.updateProfile);

router.post("/storeStock",checkAuth,bankController.storeStock);
router.put("/updateStock",checkAuth,bankController.storeStock);
router.get("/getStockOfBank",checkAuth,bankController.getStockOfBank);
router.get("/getRequestsFromUser",checkAuth,bankController.bloodRequestFromUser);

router.get("/getAllBank",checkAuth,functionController.allBankDetails);

router.get("/camp",checkAuth,campController.showCampByBank);
router.post("/organizeCamp",checkAuth,campController.organizeCamp);

module.exports = router;
