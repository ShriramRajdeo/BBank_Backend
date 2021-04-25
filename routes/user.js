const express = require("express");
const router = express.Router();
const userController = require('../controllers/user.controller');
const checkAuth = require('../middleware/check-auth');


router.get("/",checkAuth,function(req,res){
    res.send("In user");    
});

router.get("/profile",checkAuth,userController.profile);

router.get("/camp",checkAuth,userController.showCamp);

module.exports = router;