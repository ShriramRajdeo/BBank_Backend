const express = require("express");
const router = express.Router();
const userController = require('../controllers/user.controller');
const campController = require('../controllers/camp.controller');
const checkAuth = require('../middleware/check-auth');


router.get("/",checkAuth,function(req,res){
    res.send("In user");    
});

router.get("/profile",checkAuth,userController.profile);

router.post("/request",checkAuth,userController.addRequest);
router.get("/getStock",checkAuth,userController.getStock);


router.get("/camp",checkAuth,campController.showCampsToUser);


module.exports = router;