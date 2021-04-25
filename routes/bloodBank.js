const express = require("express");
const router = express.Router();
const bankController = require('../controllers/bank.controller');
const campController = require('../controllers/camp.controller');
const checkAuth = require('../middleware/check-auth');

router.get("/",checkAuth,function(req,res){
    res.send("In Blood Bank");    
});

router.get("/profile",checkAuth,bankController.profile);
router.post("/storeStock",checkAuth,bankController.storeStock);
router.get("/getStockOfBank",checkAuth,bankController.getStockOfBank);


router.get("/camp",checkAuth,campController.showCampByBank);
router.post("/organizeCamp",checkAuth,campController.organizeCamp);

module.exports = router;