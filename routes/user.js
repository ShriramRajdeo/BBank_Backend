const express = require("express");
const router = express.Router();
const userController = require('../controllers/user.controller');
const campController = require('../controllers/camp.controller');
const functionController = require('../controllers/bbAndStock.controller');

const checkAuth = require('../middleware/check-auth');


router.get("/",checkAuth,function(req,res){
    res.send("In user");
});

router.get("/profile",checkAuth,userController.profile);
router.put("/updateProfile",checkAuth,userController.updateProfile);

router.post("/addRequest",checkAuth,userController.addRequest);
router.get("/showRequest",checkAuth,userController.showRequest);
router.get("/getStock",checkAuth,userController.getStock);
router.get("/getAllBank",checkAuth,functionController.allBankDetails);
router.get("/getCamp",checkAuth,campController.showCampsToUser);

router.get("/count",checkAuth,functionController.getCounts);

module.exports = router;